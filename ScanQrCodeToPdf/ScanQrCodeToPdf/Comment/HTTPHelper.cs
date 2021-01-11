using Newtonsoft.Json;
using SeaSky.StandardLibNew.MyModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace ScanQrCodeToPdf
{
    public class HttpHelper
    {
        #region PostMethod
        public static string PostMethod(string url, DataTypeEnum ContentType, string strData)
        {
            string result = string.Empty;
            WebRequest request = WebRequest.Create(url);
            request.Method = "POST";
            request.Method = MethodTypeEnum.Post.ToString();
            if (ContentType == DataTypeEnum.form)
            {
                request.ContentType = "application/x-www-form-urlencoded";
            }
            else
            {
                request.ContentType = "application/" + ContentType.ToString();
            }

            byte[] reqBodyBytes = System.Text.Encoding.UTF8.GetBytes(strData);
            Stream reqStream = request.GetRequestStream();//加入需要发送的参数
            reqStream.Write(reqBodyBytes, 0, reqBodyBytes.Length);
            reqStream.Close();
            using (StreamReader reader = new StreamReader(request.GetResponse().GetResponseStream()))
            {
                result = reader.ReadToEnd();
            }
            return result;
        }

        /// <summary>
        /// Post带参请求
        /// </summary>
        /// <typeparam name="T">转换的参数</typeparam>
        /// <param name="url"></param>
        /// <param name="ContentType">指定参数类型</param>
        /// <param name="strData"></param>
        /// <returns></returns>
        public static BaseResultModel<T> PostRequest<T>(string url, DataTypeEnum ContentType, string strData)
        {
            string result = string.Empty;
            //url = webApiUrl + url;
            WebRequest webRequest = WebRequest.Create(url);
            webRequest.Method = MethodTypeEnum.Post.ToString();

            if (ContentType == DataTypeEnum.form)
            {
                webRequest.ContentType = "application/x-www-form-urlencoded";
            }
            else
            {
                webRequest.ContentType = "application/" + ContentType.ToString();
            }

            byte[] reqBodyBytes = System.Text.Encoding.UTF8.GetBytes(strData);
            Stream reqStream = webRequest.GetRequestStream();//加入需要发送的参数
            reqStream.Write(reqBodyBytes, 0, reqBodyBytes.Length);
            reqStream.Close();
            HttpWebResponse res;
            try
            {
                res = (HttpWebResponse)webRequest.GetResponse();
            }
            catch (WebException e)
            {
                res = (HttpWebResponse)e.Response;
            }
            using (StreamReader reader = new StreamReader(res.GetResponseStream()))
            {
                result = reader.ReadToEnd();
            }
            try
            {
                IDictionary<string, object> resultDicText = JsonConvert.DeserializeObject<IDictionary<string, object>>(result);
                if ((bool)resultDicText["isSuccess"])
                {
                    return JsonConvert.DeserializeObject<SuccessResultModel<T>>(result);
                }
            }
            catch (Exception e)
            {
                return new ErrorResultModel<T>(EnumErrorCode.系统异常, e.Message);
            }
            try
            {
                return JsonConvert.DeserializeObject<ErrorResultModel<T>>(result);
            }
            catch
            {
                ErrorResultModel<object> r = JsonConvert.DeserializeObject<ErrorResultModel<object>>(result);
                return new ErrorResultModel<T>(r.ErrorCode, r.ErrorMessage);
            }
        }
        #endregion

        #region GetMethod
        public static string GetMethod(string url)
        {
            //url = webApiUrl + url;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            //request.ContentType = "text/html;charset=UTF-8"; 
            request.ContentType = "application/json";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.UTF8);
            string retString = myStreamReader.ReadToEnd();
            myStreamReader.Close();
            myResponseStream.Close();
            return retString;
        }
        #endregion
    }

    /// <summary>
    /// 带参数据类型
    /// </summary>
    public enum DataTypeEnum
    {
        json,
        xml,
        form
    }

    /// <summary>
    /// 带参数据类型
    /// </summary>
    public enum MethodTypeEnum
    {
        Get,
        Post
    }
}