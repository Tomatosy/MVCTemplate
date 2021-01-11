

// ----------------------------------------------------------------------
// <summary>
// 扩展String类，添加Format静态方法，模仿C#中的String.Format方法
// </summary>
// <returns>str</returns>
// ----------------------------------------------------------------------
if (!String.Format) {
    String.Format = function () {
        if (arguments.length == 0) {
            return null;
        }
        var str = arguments[0];
        if (arguments[1] instanceof Array) {
            var arr = arguments[1];
            for (var i = 0; i < arr.length; i++) {
                var re = new RegExp('\\{' + i + '\\}', 'gm');
                str = str.replace(re, arr[i]);
            }
        } else {
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);

            }
        }
        return str;
    }
}