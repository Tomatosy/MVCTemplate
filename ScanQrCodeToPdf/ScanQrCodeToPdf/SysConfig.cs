using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScanQrCodeToPdf
{
    public class SysConfig
    {
        public static string HttpUrl => ConfigurationManager.AppSettings["HttpUrl"];
        public static string SystemID => ConfigurationManager.AppSettings["SystemID"];
        public static string Secret => ConfigurationManager.AppSettings["Secret"];
    }
}

