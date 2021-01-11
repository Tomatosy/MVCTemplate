var imgSrc = []; //鍥剧墖璺緞
var imgFile = []; //鏂囦欢娴�
var imgName = []; //鍥剧墖鍚嶅瓧
//閫夋嫨鍥剧墖
function imgUpload(obj) {
    var oInput = '#' + obj.inputId;
    var imgBox = '#' + obj.imgBox;
    var btn = '#' + obj.buttonId;
    $(oInput).on("change", function () {
        var fileImg = $(oInput)[0];
        var fileList = fileImg.files;
        for (var i = 0; i < fileList.length; i++) {
            var imgSrcI = getObjectURL(fileList[i]);
            imgName.push(fileList[i].name);
            imgSrc.push(imgSrcI);
            imgFile.push(fileList[i]);
        }
        addNewContent(imgBox);
    })
    $(btn).on('click', function () {
        $(btn).attr("disabled", "disabled");
        $(btn).text("上传中...");
        $(btn).css("background-color", "#dcdcdc");
        $(btn).css("border", "1px solid #dcdcdc");
        var formData = new FormData();
        for (var i = 0; i < imgFile.length; i++) {
            formData.append("file" + i, imgFile[i]);
        }
        // var data = new FormData($('#' + obj.inputId)[0].files[0]);
        //data[obj.data] = imgFile;
        submitPicture(obj.upUrl, formData, obj.success, function () {
            $(btn).removeAttr("disabled");
            $(btn).text("上传");
            $(btn).css("background-color", "cornflowerblue");
            $(btn).css("border", "1px solid cornflowerblue");
        });
    })
}
//鍥剧墖灞曠ず
function addNewContent(obj) {
    $(imgBox).html("");
    for (var a = 0; a < imgSrc.length; a++) {
        var oldBox = $(obj).html();
        $(obj).html(oldBox + '<div class="imgContainer"><img title=' + imgName[a] + ' alt=' + imgName[a] + ' src=' + imgSrc[a] + ' onclick="imgDisplay(this)"><p onclick="removeImg(this,' + a + ')" class="imgDelete">删除</p></div>');
    }
}
//鍒犻櫎
function removeImg(obj, index) {
    imgSrc.splice(index, 1);
    imgFile.splice(index, 1);
    imgName.splice(index, 1);
    var boxId = "#" + $(obj).parent('.imgContainer').parent().attr("id");
    addNewContent(boxId);
}
//涓婁紶(灏嗘枃浠舵祦鏁扮粍浼犲埌鍚庡彴)
function submitPicture(url, data, success, complete) {
    //console.log(data);
    //alert('璇锋墦寮€鎺у埗鍙版煡鐪嬩紶閫掑弬鏁帮紒');
    if (url && data) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (dat) {
                //			console.log(dat);
                if (success) {
                    success(dat);
                }
            },
            complete: function (d) {
                if (success) {
                    success(dat);
                }

            }
        });
    }
}
//鍥剧墖鐏
function imgDisplay(obj) {
    var src = $(obj).attr("src");
    var imgHtml = '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 1000;"><img src=' + src + ' style="margin-top: 100px;width: 70%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">脳</p></div>'
    $('body').append(imgHtml);
}
//鍏抽棴
function closePicture(obj) {
    $(obj).parent("div").remove();
}

//鍥剧墖棰勮璺緞
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}