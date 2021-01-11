
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScanQrCodeToPdf.Models
{
    public class PdfResultModel
    {
        /// <summary>
        ///    文件名称
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 文件路径
        /// </summary>
        public string File { get; set; }
    }
}