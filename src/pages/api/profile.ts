import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { createWriteStream } from "fs";

// Next.jsデフォルトの"application/json"等に対する読込みを無効化
export const config = {
  api : {
    bodyParser : false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: true, uploadDir: __dirname });
  let userName: string = '';
  let fileName: string | undefined;

  const parseForm = () => {
    return new Promise<void>((resolve, reject) => {
      console.log('parseForm() starts.');

      // ファイル取得
      form.onPart = (part) => {
        // let formidable handle only non-file parts
        if (part.originalFilename === "" || !part.mimetype) {
          // used internally, please do not override!
          form._handlePart(part);
        } else if (part.originalFilename) {
          console.log(part.name + '...');
          fileName = part.originalFilename;

          // ファイル書き出し
          const path = "./public/uploads/" + new Date().getTime() + part.originalFilename;
          const stream = createWriteStream(path);
          part.pipe(stream);

          part.on("end", () => {
            console.log(part.originalFilename + " is uploaded");
            stream.close();
          });
        }
      };

      // ファイル以外のフィールド取得
      form.on('field', (name, value) => {
        console.log(name + ': ' + value);
        if (name === 'username') userName = value;
      })

      form.parse(req, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  try {
    await parseForm();
    res.status(200).json({ username: userName, picture: fileName });
  } catch (error) {
    console.error("Error parsing the form: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}