// ==UserScript==
// @name        Gab.ai Hashtag Previewer
// @author      @FuckingHackers on gab.ai
// @description When you select a post from the home page you'll be able to see the most recent threads on the hashtags that it contains
// @namespace   gabai
// @include     https://gab.ai/*
// @version     1.1
// @grant       none
// ==/UserScript==

function getNthParent(element, n) {
    while(n>0) {
        element = element.parentNode;
        n--;
    }
    return element;
}

function start() {
    var hashtags = null;
    var classes = null;
    var target = null;
    var count = 0;

    //Code here will be run every 3 seconds
    var interval = 3;

    var openerInt = window.setInterval(function(){
        try {
            hashtags = document.getElementsByClassName('inner-post-hashtag');
            for(var i=0; i<hashtags.length; i++) {
                if (!hashtags[i].classList.contains("setted") && (getNthParent(hashtags[i], 12).classList.contains('post-modal') || window.location.pathname.split('/')[2] == "posts")) {
                    classes = hashtags[i].className.split(' ')[1];
                    target = classes.split("--")[1];
                    $.ajax({
                        url: "https://gab.ai/api/search?sort=date&q="+target,
                        context: this,
                        success: function(result) {
                            var varSpoiler = document.createElement('div');
                            varSpoiler.id = "spoiler"+count;
                            varSpoiler.setAttribute('style','display:none; color: #000;');

                            var html = '';
                            html += '<div style="margin: 10px; padding: 10px;  border-radius: 5px; border-color: #fff; background-color: #333; color: #fff;"><strong>Recent posts about '+target+':</strong>';

                            $.each(result.data.slice(0,5), function(i, data) {
                                html += '<div style="display: flex; margin-top: 20px;">';
                                html += '<img src='+result.data[i].actuser.picture_url+' style="border-radius: 50%; margin-right: 10px; margin-top: 3px; width:35px; height:35px;">';
                                html += '<span style="flex: 1;">';
                                html += '<a style="color:#2dd"; href="https://gab.ai/'+result.data[i].actuser.username+'"><strong>'+result.data[i].actuser.name+'</strong></a> - @'+result.data[i].actuser.username+' - <strong>Post (<a href="https://gab.ai/'+result.data[i].actuser.username+'/posts/'+result.data[i].id+'">Link</a>):</strong> '+result.data[i].post.body;
                                html += '</span>';
                                html += '</div>';
                            });
                            html += '</div></div>';
                            var varButton = document.createElement('button');
                            varButton.id = "button"+count;
                            varButton.title ="Click to show/hide content";
                            varButton.type="button";
                            varButton.innerHTML="#"+target+" (Show/hide)";
                            varButton.setAttribute('style','border-radius: 4px; color:#bbb; border: 2px solid #bbb; background-color: transparent;');
                            varButton.onclick = function() {
                                if(varSpoiler.style.display=="none") {
                                    varSpoiler.style.display="";
                                } else {
                                    varSpoiler.style.display="none";
                                }
                            };

                            var container = document.createElement('div');
                            container.className = "hashtag-actions";
                            container.setAttribute('style','margin-top: 10px;');
                            $(container).append(varButton);
                            $(varSpoiler).append(html);
                            $(container).append(varSpoiler);

                            $(hashtags[i]).parents().eq(1).append(container);

                            count++;
                        },
                        async: false
                    });
                    hashtags[i].className += " setted";
                }
            }
        } catch(err) {
            //When something breaks, just nuke it
            window.clearInterval(openerInt);
            alert("Error during execution");
        }


    }, interval*1000);

}

start();
