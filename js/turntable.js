$(function(){
    var count = 3,
        gameInfo = {
            gameNo: 'GAzmjQ678p',//游戏名字
        },
        adInfo = {},
        baseUrl = '//apneo.cn/tuia/api',//公共接口
        _pathSearch = location.search,//返回URL？后面的字符串
        _cardsBox = $('.turntable_game .cards_box'),
        _gameBegin = $('.turntable_game .cards_box .card_pic'),//卡片
        _cardMask =$('.turntable_game .cards_box .card_mask'),//游戏卡片遮罩层
        _maskLayer =$('.mask_layer'),//遮罩层
        _turntableMoreGame=$('.turntable_moreGame'),//更多游戏
        _moregameClose=$('.game_close'),//更多游戏关闭按钮
        _turntableWin=$('.turntable_win'),//赢取页面
        _winClose=$('.turntable_win .turntable_winTop .win_close'),//获奖页面关闭按钮
        _turntableRule=$('.turntable_rule'),//规则按钮
        _turntableRuleInfo=$('.turntableRule_info'),//规则详情页
        _turntableNum=$('.turntable_num .count'),//游戏次数
        _ruleClose=$('.rule_close');//规则关闭按钮

        var sUserAgent = navigator.userAgent;
        var isAndroid = sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Adr') > -1;
        var pathArr = location.pathname.split('/');
        var hName = pathArr[pathArr.length - 1].split('.')[0];


        //游戏次数
        $.ajax({
            url: baseUrl + '/stat/pv' + _pathSearch,
            type: 'get',
            dataType: 'json',
            data: {
                type: '6',
                val: gameInfo.gameNo
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                console.log(res);
                count = res;
                _turntableNum.html(count);
            }
        });

        // 游戏点击
        var pvCount = function (type, val) {
            $.ajax({
                url: baseUrl + '/stat/pv' + _pathSearch,
                type: 'get',
                data: {
                    type: type,
                    val: val
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res);
                }
            })
        };

        //获取广告
        var getAdvert = function () {
            $.ajax({
                url: baseUrl + '/ad/get' + _pathSearch,
                type: 'get',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res);
                    if (res.totalNums == 0) {
                        $('.win_btn').html('笑纳了');
                        $('.win_advert').attr('src', '//apmou.cn/tuia/img/luckyad.jpg');
                        $('win_tel').html('恭喜您获得');
                        $('win_text').html('幸运上上签:今天大吉大利');
                    } else {
                        adInfo = res.ads[0];
                        $('.win_btn').html('立即领取');
                        $('.win_advert').attr('src', '//apmou.cn/tuia/img/' + adInfo.adNo + '.jpg');
                        $('.win_text').html(adInfo.adDesc);
                        pvCount('4', adInfo.adNo);
                    }
                }
            })
        }

        //获取更多游戏
        var moreGameInfo = function () {
            $.ajax({
                url: baseUrl + '/game/list' + _pathSearch,
                type: 'get',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res);
                    if (res.totalNums > 0) {
                        _turntableMoreGame.children('.flag').remove();
                        var data = res.game;
                        for (var i = 0; i < data.length; i++) {
                            $('.game_footer').before('<img src="//apmou.cn/tuia/img/' + data[i].gameNo + '.png" class="otherGameList flag" data-url="//apmou.cn/tuia/' + data[i].gameNo + '.html">');
                        }
                    }
                },
                error: function (xhr, error) {}
            })
        }

        //点击广告跳转
        var clickAdvert = function () {
            if (!adInfo.adNo) {
                $('.content .pic').removeClass('moves')
                $('.mark').css('display', 'none');
                $('.win').hide();
                $('.pic').attr('style', 'none');
                game_move();
            } else {
                pvCount('5', adInfo.adNo);
                // adInfo.adType==1?location.href=adInfo.apkUrl:location.href=adInfo.landpageUrl;
                location.href = adInfo.apkUrl;
                setTimeout(function () {
                    location.href = adInfo.landpageUrl;
                }, 1500);
            }
        }
           //点击量计算
        var cnzz = function () {
            var thisPath = $(this).attr('src').split('/');
            var imgName = thisPath[thisPath.length - 1];
            _czc.push(["_trackEvent", hName, "click", imgName, "", '']);
        }

        //页面加载 执行动画
        game_move();
        var timer=null;
        var timer1=null;
        function game_move() {
            $('.card1').animate({ top: '12%', left: '11%' }, 200);
            $('.card2').delay(200).animate({ top: '12%', left: '41%' }, 200);
            $('.card3').delay(400).animate({ top: '12%', left: '71%' }, 200);
            $('.card4').delay(800).animate({ bottom: '12%', left: '11%' }, 200);
            $('.card5').delay(1000).animate({ bottom: '12%', left: '41%' }, 200);
            clearTimeout(timer);
           timer1= setTimeout(function () {
                var i = 0;
                clearInterval(timer);
                timer = setInterval(function () {
                    _cardMask.css('display', 'none');
                    if (i > _cardMask.length - 1) { i = 0 };
                    _cardMask.eq(i).css('display', 'block');
                    i++;
                }, 600);
            }, 1000);
        }
        //点击规则
        _turntableRule.on('tap',function(){
            // cnzz.apply($(this));
            _maskLayer.show();
            _turntableRuleInfo.show();
        });
        //隐藏规则信息
        _ruleClose.on('tap',function(){
            // cnzz.apply($(this));
            _maskLayer.hide();
            _turntableRuleInfo.hide();
        });
        //点击开始抽奖
        _gameBegin.on('tap',function(){
            console.log(this);
            console.log($(this).parent())
            // cnzz.apply($(this));
            clearInterval(timer);
            _cardMask.hide();
            if (count == 0) {
                _maskLayer.show();
                _turntableMoreGame.show();
                moreGameInfo();
                return false;
            }else{
                _maskLayer.show();
                $(this).parent().animate({ zIndex: '6', top: '34%', left: '40%' }, 500, function () {
                    $(this).addClass('moves');
                }).delay(3000).animate({ opacity: '0' }, function () {
                    _turntableWin.show();
                });
                getAdvert();
            }
             count--;
             _turntableNum.html(count);
            //  pvCount('3', gameInfo.gameNo);
        });
        //点击关闭中奖页面
        _winClose.on('tap',function(){
            // cnzz.apply($(this));
            _maskLayer.hide();
            _turntableWin.hide();
            _cardsBox.attr('style','none').removeClass('moves');
            game_move();
        });
        //点击游戏跳转
        _turntableMoreGame.on('click','.flag',function(){
            // cnzz.apply($(this));
            location.href = $(this).data('url') + _pathSearch;
        })
        //点击关闭更多游戏页面
        _moregameClose.on('tap',function(){
            // cnzz.apply($(this));
            _maskLayer.hide();
            _turntableMoreGame.hide();
        });
        //游戏展现
        $(function () {
            pvCount('2', gameInfo.gameNo);
        })
});