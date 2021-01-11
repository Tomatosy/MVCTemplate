jQuery.cw = {
    removeAaary: function (_arr, _obj) {
        var length = _arr.length;
        for (var i = 0; i < length; i++) {
            if (_arr[i] == _obj) {
                if (i == 0) {
                    _arr.shift(); //删除并返回数组的第一个元素
                    return _arr;
                }
                else if (i == length - 1) {
                    _arr.pop();  //删除并返回数组的最后一个元素
                    return _arr;
                }
                else {
                    _arr.splice(i, 1); //删除下标为i的元素
                    return _arr;
                }
            }
        }
    },
    getQueryString: function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },
    getCookie: function (cookieName) {
        return $.cookie(cookieName);
    },
    getCookieObj: function (cookieName) {
        var cookie = this.getCookie(cookieName);
        if (cookie) {
            return JSON.parse(cookie);
        } else {
            return null;
        }
    },
    setCookie: function (cookieName, cookieValue, expiresDay) {
        if (!expiresDay) {
            expiresDay = 1;
        }
        $.cookie(cookieName, cookieValue, { expires: expiresDay, path: '/' });
    },
    deleteCookie: function myfunction(cookieName) {
        $.cookie(cookieName, '', { expires: -1, path: '/' });
    },
    getUserInfo: function () {
        var userInfo = this.getCookieObj("CurrentUserInfo");
        return userInfo;
    },
    getUserLoginID: function () {
        var userLoginID = this.getCookie("YYTAppUserId");
        return userLoginID;
    },
    ImgServerUrl: "https://pic.yunyutian.cn",
    gotoIndex: function () {
        var herf = "/Phone"
        window.location.href = herf;
    },
    logout: function () {
        $.cw.deleteSiteCookie();
        if (this.isApp(true)) {
            YYT.Logout();
        } else {
            var herf = "/Phone/Home/Login"
            window.location.href = herf;
        }
    },
    isApp: function (isShow) {
        var isShow = isShow == true ? true : false
        if (typeof (YYT) != "undefined") {
            return true;
        } else {
            if (isShow == false) {
                layer.msg("该功能需在安卓云于天APP上使用", { time: 2000 });
            }

            return false;

        }
    },
    callPhone: function (phone) {
        YYT.CallPhone(phone);
    },

    checkPhone: function (tel) {
        var TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
        if (TEL_REGEXP.test(tel)) {
            return true;
        }
        return false;
    },

    getHandleInfo: function () {
        var chooseHandleData = [

            {
                value: '0',
                text: '发送微信邀请函'
            },
            {
                value: '1',
                text: '延迟五天提醒'
            },
            {
                value: '2',
                text: '当月不在提醒'
            },
            {
                value: '3',
                text: '更改销售负责人'
            },
            {
                value: '4',
                text: '移除客户池'
            },
            {
                value: '5',
                text: '修改预订单'
            },
            {
                value: '6',
                text: '取消预订单原因'
            },

        ]
        return chooseHandleData
    },
    updatefixedSales: function (data, success, removeRecordData) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY19/UpdateByDto',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {
            success(result);

            // 添加客户池变更记录
            var ajaxOptionRecords = {
                url: '/api/services/app/CY65/CreateByDto',
                data: JSON.stringify(removeRecordData)
            };
            abp.ajax(ajaxOptionRecords).done();
        });


    },
    //延迟五天提醒
    delayFiveDaysRemind: function (data, success) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY61/UpdateByDto',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {

            success(result);



        });


    },
    //当月不在提醒
    currentMonthNoRemind: function (data, success) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY61/UpdateByDto',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {
            success(result);
        });
    },
    //发送微信邀请函
    sendWeiXinInvite: function (data, success) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY67/GetSmsTemplateListDetails',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {
            success(result);
        });
    },
    //发送短信内容模板
    sendMessage: function (data, success) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY67/GetSmsTemplateListDetails',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {
            success(result);
        });
    },
    //获取取消预订单原因
    cancelReason: function (data, success) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY63/GetViewPage',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {
            success(result);
        });
    },
    // 确认取消订单
    confirmCancelReason: function (data, success) {
        var self = this;
        var ajaxOptions = {
            url: '/api/services/app/CY20/UpdateByDto',
            data: JSON.stringify(data)
        };
        abp.ajax(ajaxOptions).done(function (result) {
            success(result);
        });
    },
    bodyScroll: function (event) {
        event.preventDefault(); //阻止元素发生默认的行为
    },
    gotoCustom: function (customerId, phone) {
        if (customerId) {
            var query = {
                customerId: customerId,
            }
            var herf = "/Phone/Customer/CustomerInfo?" + $.param(query);
            window.location.href = herf;
        } else {
            var herf = "/Phone/Customer/AddCustomerInfo?phone=" + phone;
            window.location.href = herf;
        }
    },
    goBack: function () {
        history.go(-1);
    },
    deepCopy: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    dialog: function (content, success, title) {
        var btnArray = ['确定', '取消'];
        mui.confirm(content, title || "", btnArray, function (e) {
            if (e.index == 0) {
                success();
            }
        })
    },

    //切换上一个销售经理
    getPreSales: function (MarketData, CustomFollowData) {
        var MarketData = MarketData
        var currentMarketerId = CustomFollowData.marketerId || CustomFollowData.marketerId || CustomFollowData.marketId;
        if (currentMarketerId) {
            index = _.findIndex(MarketData, function (item) {
                return item.value == currentMarketerId;
            });
            index = (index - 1) < 0 ? MarketData.length - 1 : index - 1;
        } else {
            index = 0;
            CustomFollowData.searchType = 1
            CustomFollowData.bookRange = 1
        }

        var CurrentSalesInfo = MarketData[index];
        return CurrentSalesInfo
    },
    ////切换下一个销售经理
    getNextSales: function (MarketData, CustomFollowData) {
        var MarketData = MarketData
        var currentMarketerId = CustomFollowData.marketerId || CustomFollowData.marketerId || CustomFollowData.marketId;
        if (currentMarketerId) {
            index = _.findIndex(MarketData, function (item) {
                return item.value == currentMarketerId;
            });
            index = (index + 1) > MarketData.length - 1 ? 0 : index + 1;
        } else {
            index = MarketData.length - 1
            CustomFollowData.searchType = 1
            CustomFollowData.bookRange = 1
        }
        var CurrentSalesInfo = MarketData[index];
        return CurrentSalesInfo
    },
    chooseMonthDate: function (newDate) {
        var options = { type: 'month' }
        var dtPicker = new mui.DtPicker(options);
        dtPicker.show(function (selectItems) {
            var chooseDate = selectItems.y.value + "-" + selectItems.m.value;
            newDate = chooseDate;
        })
    },
    setChooseMarketData: function (datas) {
        sessionStorage.setItem("chooseMarketData", JSON.stringify(datas));
    },
    getChooseMarketData: function () {
        return JSON.parse(sessionStorage.getItem("chooseMarketData"));
    },
    setAllChooseMarketData: function (datas) {
        sessionStorage.setItem("chooseAllMarketData", JSON.stringify(datas));
    },
    getAllChooseMarketData: function () {
        return JSON.parse(sessionStorage.getItem("chooseAllMarketData"));
    },
    setSalesAuthority: function (datas) {
        sessionStorage.setItem("SalesAuthority", JSON.stringify(datas));
    },
    getSalesAuthority: function () {
        var item = sessionStorage.getItem("SalesAuthority");
        if (!item) {
            return { isAdjustMarket: 0, isSeeAll: 0 };
        } else {
            return JSON.parse(item);
        }
    },
    deleteSiteCookie: function () { // 删除站点的cookie
        $.cw.deleteCookie("CurrentUserInfo");
        $.cw.deleteCookie("YdmAbpAuthorization");
        $.cw.deleteCookie("YYTAppUserId");
    },
    currentCustomerItem: null, // 用于点击进入客户详情保持的点击的Item
    currentAddCustomer: null // 用于点击进入新增客户的Item
}



//Array.prototype.deleteAt = function (index) {
//    if (index < 0) {
//        return this;
//    }
//    return this.slice(0, index).concat(this.slice(index + 1, this.length));
//}