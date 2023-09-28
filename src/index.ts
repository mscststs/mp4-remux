import { Mp4Stream } from "./Mp4Stream.class";
import * as Boxes from "./boxes.class";

export default function remux(vs: ReadableStream, as: ReadableStream) {
  //  读取两个stream的数据
  const videoReader = vs.getReader();
  const audioReader = as.getReader();

  const videoStream = new Mp4Stream();
  const audioStream = new Mp4Stream();

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  let status = -1;

  function callWrite(buf: Uint8Array) {
    writer.write(buf);
  }

  async function checkStream() {
    if (status === -1) {
      // 合并 moov 中的 track 信息
      const videoMoov = videoStream.moov;
      const audioMoov = audioStream.moov;
      if (videoMoov && audioMoov) {

        const videoMvex = videoMoov.mvex;
        const audioMvex = audioMoov.mvex;
        if (videoMvex && audioMvex) {
          const videoTrex = videoMvex.trex;
          const audioTrex = audioMvex.trex;

          videoTrex.track_id = 1;
          audioTrex.track_id = 2;

          // console.log(videoMvex, audioMvex);
          videoMvex.boxs = [];
          videoTrex && videoMvex.boxs.push(videoTrex);
          audioTrex && videoMvex.boxs.push(audioTrex);
        }

        const videoTrak = videoMoov.trak;
        const audioTrak = audioMoov.trak;
        if (videoTrak && audioTrak) {
          videoTrak.tkhd.track_id = 1;
          audioTrak.tkhd.track_id = 2;

          videoMoov.boxs.push(audioTrak);
          for (const item of videoStream.boxs) {
            callWrite(item.raw);
            if (item === videoMoov) {
              break;
            }
          }
          status = 1;
        }
      }
    }

    // 需要先有 sidx
    if (!videoStream.sidx || !audioStream.sidx) {
      return;
    }

    if (status !== -1) {
      const videoMaxIndex = videoStream.sidx.reference_count;
      const audioMaxIndex = audioStream.sidx.reference_count;
      if (status <= videoMaxIndex && status <= audioMaxIndex) {
        // 合并

        // Step1 获取需要的分片数据
        const videoMoof = videoStream.boxs.find((item) => {
          return (
            item instanceof Boxes.moof && item?.mfhd.sequence_number === status
          );
        }) as Boxes.moof;
        const audioMoof = audioStream.boxs.find((item) => {
          return (
            item instanceof Boxes.moof && item?.mfhd.sequence_number === status
          );
        }) as Boxes.moof;
        const videoData = videoMoof && (videoStream.boxs[videoStream.boxs.indexOf(videoMoof) + 1] as Boxes.mdat);
        const audioData = audioMoof && (audioStream.boxs[audioStream.boxs.indexOf(audioMoof) + 1] as Boxes.mdat);

        if (videoMoof && videoData && audioMoof && audioData) {
          // 处理合并流程
          const videoTraf = videoMoof.traf;
          const audioTraf = audioMoof.traf;

          videoTraf.tfhd.track_id = 1;
          audioTraf.tfhd.track_id = 2;
          if (videoTraf?.trun && audioTraf?.trun) {
            const audioTrafSize = audioTraf.size;
            const videoMoofSize = videoMoof.size;
            const videoDataSize = videoData.size;
            videoTraf.trun.data_offset = videoMoofSize + audioTrafSize + 8;
            audioTraf.trun.data_offset = videoMoofSize + audioTrafSize + videoDataSize;

            videoMoof.boxs.push(audioTraf);

            callWrite(videoMoof.raw);

            // 处理 mdat 合并
            videoData.push(audioData.raw.slice(8));
            callWrite(videoData.raw);

            // 释放存储空间
            videoStream.boxs = videoStream.boxs.filter((item) => item !== videoMoof);
            videoStream.boxs = videoStream.boxs.filter((item) => item !== videoData);
            audioStream.boxs = audioStream.boxs.filter((item) => item !== audioMoof);
            audioStream.boxs = audioStream.boxs.filter((item) => item !== audioData);

            status += 1;
            checkStream();
          }
        }
      } else if (status > videoMaxIndex && status <= audioMaxIndex) {
        // 追加 audio
        const audioMoof = audioStream.boxs.find((item) => {
          return (
            item instanceof Boxes.moof && item?.mfhd.sequence_number === status
          );
        }) as Boxes.moof;
        audioMoof.traf.tfhd.track_id = 2;
        const audioData = audioMoof && (audioStream.boxs[audioStream.boxs.indexOf(audioMoof) + 1] as Boxes.mdat);
        if (audioMoof && audioData) {
          callWrite(audioMoof.raw);
          callWrite(audioData.raw);
          status += 1;
          checkStream();
        }
      } else if (status > audioMaxIndex && status <= videoMaxIndex) {
        // 追加 Video
        const videoMoof = videoStream.boxs.find((item) => {
          return (
            item instanceof Boxes.moof && item?.mfhd.sequence_number === status
          );
        }) as Boxes.moof;
        videoMoof.traf.tfhd.track_id = 1;
        const videoData = videoMoof && (videoStream.boxs[videoStream.boxs.indexOf(videoMoof) + 1] as Boxes.mdat);
        if (videoMoof && videoData) {
          callWrite(videoMoof.raw);
          callWrite(videoData.raw);
          status += 1;
          checkStream();
        }
      } else if (status > videoMaxIndex && status > audioMaxIndex) {
        // end
        status = -2;
        // console.log("call close", status, videoMaxIndex, audioMaxIndex);
        // writer.releaseLock();
        writer.close();
      }
    }
  }

  // 并行读取两个reader的数据
  async function readerHandler(streamReader: ReadableStreamDefaultReader<any>, mp4Stream: Mp4Stream) {
    while (true) {
      const { done, value } = await streamReader.read();
      if (value) {
        mp4Stream.push(value);
        mp4Stream.parse();

        checkStream();
      }
      // 将value拼接到 chunk后

      if (done) {
        mp4Stream.end();
        checkStream();
        break;
      }
    }
  }

  readerHandler(videoReader, videoStream);
  readerHandler(audioReader, audioStream);
  return readable;
}
