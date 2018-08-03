// ==================================================
// youCover v.alpha
//
// Licensed GPLv3 for open source use
//
// ==================================================

(function ( $ ) {
    var youCover = function(el,attributes){
        var smallScreen = (window.matchMedia('(max-width: 767px)').matches);
        var is_mobile   = (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent));
        var $el         = $(el), data = $el.data();
        var coverUrl    =  "https://img.youtube.com/vi/%yid%/maxresdefault.jpg";
        var $wrapper    = $("<a href='javascript:void(0);'></a>");
        var $iframe     = $("<iframe />");
        var $cover      = $("<img />");
        

        //merge attributes and keep only iframe attributes
        attributes = $.extend( {},attributes,data);
        $wrapper.addClass(attributes.wrapperclass);

        delete attributes.wrapperclass;
        delete attributes.youcover;
        delete attributes.fancybox;
        delete attributes.rel;

        if(data.id){
            data.src = "https://www.youtube.com/embed/" + data.id + "?rel=0&amp;autoplay=1";
            attributes.src = data.src;
        }

        var yId         = data.id || youtube_parser(attributes.src);
        var url         = coverUrl.replace("%yid%",yId);
        var coverImage  = data.image || url;
        //put autoplay param
        var aP = attributes.src.indexOf('autoplay');
        if(aP && !is_mobile) if(aP==-1) attributes.src += "&amp;autoplay=1"; else attributes.src = attributes.src.replace("autoplay=0","autoplay=1");
        
        if(undefined != data.fancybox && $.fn.fancybox){
            $wrapper.attr('data-fancybox',data.rel || false)
                    .attr('href',attributes.src)
                    .attr('rel',data.rel);
            $cover.attr('src',coverImage);
            $wrapper.append($cover);
            $el.replaceWith($wrapper);
            $wrapper.addClass('loaded');
            return $wrapper;
        }
        
        
        //apply iframe attributes
        $(attributes).each(function(idx,attr){
            for(var key in attr){
                $iframe.attr(key,attr[key]);
            }
        });


        //check mobile and use default iframe and remove autoplay options if instantiated
        if(is_mobile){
            //remove autoplay and update src with new src value
            var nsrc = attributes.src.replace("autoplay=1","autoplay=0");
            $iframe.attr('src',nsrc);
            $wrapper.addClass('active-iframe').addClass('loaded');
            $wrapper.append($iframe);
            $el.replaceWith($wrapper);
            return $wrapper;
        }
        
        $cover.attr('src',url);
        $wrapper.append($cover);
        $el.replaceWith($wrapper);
        $wrapper.addClass('loaded');
        
        $wrapper.click(function(){
            $(this).addClass('active-iframe');
            $(this).append($iframe);
        });
       
        return $wrapper;
    };

    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    /**
     * replace the default Youtube iframe player<iframe>
     * 
     * @example 
     
     * 
     * @param   {Object} [opcional]    Opcional attributes
     * @returns {Number}
     */
    $.fn.youCover = function(attributes) {
        attributes = $.extend( {}, $.fn.youCover.attributes, attributes );
        
        return $(this).each(function(){
            if($(this).hasClass('loaded')) return this;
            return new youCover(this,attributes);
        });
    };
    $.fn.youCover.attributes = {wrapperclass:'youCover'};
    //auto detect
    $("[data-youcover]").youCover();

    if($.fn.fancybox){
        var $galleryes = $("[data-fancybox][rel]");

        $galleryes.fancybox({
            beforeShow:function(){
                $galleryes.removeClass('fancybox-active');
            },
            afterShow: function( instance, slide ) {
                var a = $.fancybox.getInstance().current.opts.$orig;
                $(a).addClass('fancybox-active');
            },
            afterClose:function(){
                $galleryes.removeClass('fancybox-active');
            }
        });
    }


}( jQuery ));