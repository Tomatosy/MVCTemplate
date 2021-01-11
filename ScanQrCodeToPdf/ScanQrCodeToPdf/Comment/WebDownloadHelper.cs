using Newtonsoft.Json;
using SeaSky.StandardLibNew.MyModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace ScanQrCodeToPdf
{
    public class WebDownload
    {
        public static void DownLoad(string Url, string FileName)
        {
            bool Value = false;
            WebResponse response = null;
            Stream stream = null;

            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);

                response = request.GetResponse();
                stream = response.GetResponseStream();

                if (!response.ContentType.ToLower().StartsWith("text/"))
                {
                    Value = SaveBinaryFile(response, FileName);

                }

            }
            catch (Exception err)
            {
                string aa = err.ToString();
            }

        }

        /// <summary>
        /// Save a binary file to disk.
        /// </summary>
        /// <param name="response">The response used to save the file</param>
        // 将二进制文件保存到磁盘
        private static bool SaveBinaryFile(WebResponse response, string FileName)
        {
            bool Value = true;
            byte[] buffer = new byte[1024];

            try
            {
                if (File.Exists(FileName))
                    File.Delete(FileName);
                else
                {
                    System.IO.Directory.CreateDirectory(FileName);//不存在就创建目录
                }
                Stream outStream = System.IO.File.Create(FileName + "TEMP.pdf");
                Stream inStream = response.GetResponseStream();

                int l;
                do
                {
                    l = inStream.Read(buffer, 0, buffer.Length);
                    if (l > 0)
                        outStream.Write(buffer, 0, l);
                }
                while (l > 0);

                outStream.Close();
                inStream.Close();
            }
            catch (Exception ex)
            {
                Value = false;
            }
            return Value;
        }
    }
}