using Newtonsoft.Json;
using ScanQrCodeToPdf.Models;
using SeaSky.StandardLibNew.MyModel;
using Spire.Pdf;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Printing;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace ScanQrCodeToPdf.Controllers
{
    public class HomeController : Controller
    {

        //private Dictionary<string, DateTime> orderDic = new Dictionary<string, DateTime>();
        private static string lastOrderNo;
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 导出pdf
        /// </summary>
        /// <param name="connStr"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult QrCodeToPdf(string orderNo)
        {
            try
            {
                // 同一单号30s内只能打印一次
                //KeyValuePair<string, DateTime> sel = orderDic.FirstOrDefault(x => x.Key == orderNo);

                // 不能重复打印同一单号
                if (lastOrderNo == orderNo)
                {
                    return Json(new
                    {
                        errcode = -2,
                        errmsg = "当前单号已打印，请稍后再试！"
                    });
                }

                string httpUrl = SysConfig.HttpUrl + "ExternalInterface/ClaimsInterface/PrintOrder";
                string systemID = SysConfig.SystemID;
                string secret = SysConfig.Secret;
                string token = Md5Encrypt((systemID + "|" + DateTime.Now.ToString("yyyy-MM-dd-HH") + "|" + secret));

                // 调用外部API接口
                string strData = JsonConvert.SerializeObject(new { SystemID = systemID, Token = token, OrderNo = orderNo });
                BaseResultModel<PdfResultModel> result = HttpHelper.PostRequest<PdfResultModel>(httpUrl, DataTypeEnum.json, strData);
                if (!result.IsSuccess)
                    return Json(new
                    {
                        errcode = -1,
                        errmsg = "单号查询失败！"
                    });

                // 将服务器文件暂存本地打印
                PdfResultModel fileUrlModel = result?.Data;
                string tempFileUrl = AppDomain.CurrentDomain.BaseDirectory;
                PdfDocument doc = new PdfDocument();
                WebDownload.DownLoad(fileUrlModel.File, tempFileUrl);
                doc.LoadFromFile(tempFileUrl + @"TEMP.pdf");


                ////选择Microsoft XPS Document Writer打印机
                //doc.PrintSettings.PrinterName = "Microsoft XPS Document Writer";

                ////打印PDF文档到XPS格式
                //doc.PrintSettings.PrintToFile("PrintToXps.xps");
                doc.Print();
                //doc.Print();

                lastOrderNo = orderNo;

                return Json(new { errcode = 0, errmsg = "打印成功！" });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    errcode = -1,
                    errmsg = ex.Message
                });
            }
        }
        private string Md5Encrypt(string strPwd)
        {
            MD5 md5 = MD5.Create();
            byte[] b = md5.ComputeHash(Encoding.UTF8.GetBytes(strPwd));
            StringBuilder sb = new StringBuilder();
            foreach (byte t in b)
            {
                sb.Append(t.ToString("x2").ToUpper());
            }
            return sb.ToString();

        }


    }
}