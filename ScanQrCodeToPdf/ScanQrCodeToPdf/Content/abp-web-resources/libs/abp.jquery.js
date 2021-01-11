var abp = abp || {};
(function ($) {

    if (!$) {
        return;
    }

    /* JQUERY ENHANCEMENTS ***************************************************/

    // abp.ajax -> uses $.ajax ------------------------------------------------

    abp.ajax = function (userOptions) {
        userOptions = userOptions || {};
        if (!userOptions.type) {
            userOptions.type = "POST"
        }
        if (!userOptions.headers) {
            userOptions.headers = { 'Authorization': getAuthorizationCookie() }
        }
        var options = $.extend(true, {}, abp.ajax.defaultOpts, userOptions);
        var oldBeforeSendOption = options.beforeSend;
        options.beforeSend = function (xhr) {
            if (oldBeforeSendOption) {
                oldBeforeSendOption(xhr);
            }

            xhr.setRequestHeader("Pragma", "no-cache");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Expires", "Sat, 01 Jan 2000 00:00:00 GMT");
        };
        // options.url = "https://tapi.yunyutian.cn" + options.url;
        options.success = undefined;
        options.error = undefined;
        var maskJqSelect = options.maskJqSelect;
        if (maskJqSelect) {
            $(maskJqSelect).mask("处理中...");
        }
        return $.Deferred(function ($dfd) {
            $.ajax(options)
                .done(function (data, textStatus, jqXHR) {
                    if (maskJqSelect) {
                        $(maskJqSelect).unmask();
                    }
                    if (data.__abp) {
                        abp.ajax.handleResponse(data, userOptions, $dfd, jqXHR);
                    } else {
                        $dfd.resolve(data);
                        userOptions.success && userOptions.success(data);
                    }
                }).fail(function (jqXHR) {
                    if (jqXHR.responseJSON && jqXHR.responseJSON.__abp) {
                        abp.ajax.handleResponse(jqXHR.responseJSON, userOptions, $dfd, jqXHR);
                    } else {
                        abp.ajax.handleNonAbpErrorResponse(jqXHR, userOptions, $dfd);
                    }
                });
        });
    };

    $.extend(abp.ajax, {
        defaultOpts: {
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        },

        defaultError: {
            message: '系统繁忙',
            details: '系统繁忙,请稍后再试'
        },

        defaultError401: {
            message: '登录',
            details: '对不起，您未登录，请先登录！'
        },

        defaultError403: {
            message: '无权限',
            details: '您没有该操作的权限!'
        },

        defaultError404: {
            message: '404(资源未找到)',
            details: '服务器上找不到请求的资源.'
        },

        logError: function (error) {
            abp.log.error(error);
        },

        showError: function (error) {
            if (error.details) {
                return abp.message.error(error.details, error.message);
            } else {
                return abp.message.error(error.message || abp.ajax.defaultError.message);
            }
        },

        handleTargetUrl: function (targetUrl) {
            if (!targetUrl) {
                location.href = abp.appPath;
            } else {
                location.href = targetUrl;
            }
        },

        handleNonAbpErrorResponse: function (jqXHR, userOptions, $dfd) {
            if (userOptions.abpHandleError !== false) {
                switch (jqXHR.status) {
                    case 401:
                        //abp.ajax.handleUnAuthorizedRequest(
                        //    abp.ajax.showError(abp.ajax.defaultError401),
                        //    abp.appPath
                        //);
                        abp.ajax.showError(abp.ajax.defaultError401);
                        // $.cw.logout();
                        break;
                    case 403:
                        abp.ajax.showError(abp.ajax.defaultError403);
                        break;
                    case 404:
                        abp.ajax.showError(abp.ajax.defaultError404);
                        break;
                    default:
                        abp.ajax.showError(abp.ajax.defaultError);
                        break;
                }
            }

            $dfd.reject.apply(this, arguments);
            userOptions.error && userOptions.error.apply(this, arguments);
        },

        handleUnAuthorizedRequest: function (messagePromise, targetUrl) {
            if (messagePromise) {
                messagePromise.done(function () {
                    abp.ajax.handleTargetUrl(targetUrl);
                });
            } else {
                abp.ajax.handleTargetUrl(targetUrl);
            }
        },

        handleResponse: function (data, userOptions, $dfd, jqXHR) {
            if (data) {
                if (data.success === true) {
                    $dfd && $dfd.resolve(data.result, data, jqXHR);
                    userOptions.success && userOptions.success(data.result, data, jqXHR);

                    if (data.targetUrl) {
                        abp.ajax.handleTargetUrl(data.targetUrl);
                    }
                } else if (data.success === false) {
                    var messagePromise = null;

                    if (data.error) {
                        if (userOptions.abpHandleError !== false) {
                            messagePromise = abp.ajax.showError(data.error);
                        }
                    } else {
                        data.error = abp.ajax.defaultError;
                    }

                    abp.ajax.logError(data.error);

                    $dfd && $dfd.reject(data.error, jqXHR);
                    userOptions.error && userOptions.error(data.error, jqXHR);

                    if (jqXHR.status === 401 && userOptions.abpHandleError !== false) {
                        abp.ajax.handleUnAuthorizedRequest(messagePromise, data.targetUrl);
                    }
                } else { //not wrapped result
                    $dfd && $dfd.resolve(data, null, jqXHR);
                    userOptions.success && userOptions.success(data, null, jqXHR);
                }
            } else { //no data sent to back
                $dfd && $dfd.resolve(jqXHR);
                userOptions.success && userOptions.success(jqXHR);
            }
        },

        blockUI: function (options) {
            if (options.blockUI) {
                if (options.blockUI === true) { //block whole page
                    abp.ui.setBusy();
                } else { //block an element
                    abp.ui.setBusy(options.blockUI);
                }
            }
        },

        unblockUI: function (options) {
            if (options.blockUI) {
                if (options.blockUI === true) { //unblock whole page
                    abp.ui.clearBusy();
                } else { //unblock an element
                    abp.ui.clearBusy(options.blockUI);
                }
            }
        },

        ajaxSendHandler: function (event, request, settings) {
            var token = abp.security.antiForgery.getToken();
            if (!token) {
                return;
            }

            if (!abp.security.antiForgery.shouldSendToken(settings)) {
                return;
            }

            if (!settings.headers || settings.headers[abp.security.antiForgery.tokenHeaderName] === undefined) {
                request.setRequestHeader(abp.security.antiForgery.tokenHeaderName, token);
            }
        }
    });

    $(document).ajaxSend(function (event, request, settings) {
        return abp.ajax.ajaxSendHandler(event, request, settings);
    });

    /* JQUERY PLUGIN ENHANCEMENTS ********************************************/

    /* jQuery Form Plugin 
     * http://www.malsup.com/jquery/form/
     */

    // abpAjaxForm -> uses ajaxForm ------------------------------------------

    if ($.fn.ajaxForm) {
        $.fn.abpAjaxForm = function (userOptions) {
            userOptions = userOptions || {};

            var options = $.extend({}, $.fn.abpAjaxForm.defaults, userOptions);

            options.beforeSubmit = function () {
                abp.ajax.blockUI(options);
                userOptions.beforeSubmit && userOptions.beforeSubmit.apply(this, arguments);
            };

            options.success = function (data) {
                abp.ajax.handleResponse(data, userOptions);
            };

            //TODO: Error?

            options.complete = function () {
                abp.ajax.unblockUI(options);
                userOptions.complete && userOptions.complete.apply(this, arguments);
            };

            return this.ajaxForm(options);
        };

        $.fn.abpAjaxForm.defaults = {
            method: 'POST'
        };
    }

    abp.event.on('abp.dynamicScriptsInitialized', function () {
        abp.ajax.defaultError.message = abp.localization.abpWeb('DefaultError');
        abp.ajax.defaultError.details = abp.localization.abpWeb('DefaultErrorDetail');
        abp.ajax.defaultError401.message = abp.localization.abpWeb('DefaultError401');
        abp.ajax.defaultError401.details = abp.localization.abpWeb('DefaultErrorDetail401');
        abp.ajax.defaultError403.message = abp.localization.abpWeb('DefaultError403');
        abp.ajax.defaultError403.details = abp.localization.abpWeb('DefaultErrorDetail403');
        abp.ajax.defaultError404.message = abp.localization.abpWeb('DefaultError404');
        abp.ajax.defaultError404.details = abp.localization.abpWeb('DefaultErrorDetail404');
    });

    function getAuthorizationCookie() {
        return "Bearer " + ABPConfig.ABPAuthor;
        //var cookie = "Bearer " + $.cookie('Abp.AuthToken');
        //if (!cookie) {
        //    return null;
        //} else {
        //    return cookie
        //}
    }

})(jQuery);
