/* أدواتي — Service Worker */
var CACHE='adwati-v1';
var SHELL=['./','./index.html','./manifest.json','./icon-128.png','./icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(
      caches.open(CACHE).then(function(c){return c.addAll(SHELL);})
          .then(function(){return self.skipWaiting();})
            );
            });

            self.addEventListener('activate',function(e){
              e.waitUntil(
                  caches.keys().then(function(keys){
                        return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
                            }).then(function(){return self.clients.claim();})
                              );
                              });

                              self.addEventListener('fetch',function(e){
                                var url=e.request.url;
                                  if(e.request.method!=='GET')return;

                                    /* مكتبات CDN — شبكة أولًا مع تخزين، عشان تصلح أوفلاين بعد أول استخدام */
                                      if(/unpkg\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url)){
                                          e.respondWith(
                                                caches.open(CACHE).then(function(c){
                                                        return c.match(url).then(function(hit){
                                                                  var net=fetch(e.request).then(function(res){
                                                                              if(res&&res.ok)c.put(url,res.clone());
                                                                                          return res;
                                                                                                    }).catch(function(){return hit;});
                                                                                                              return hit||net;
                                                                                                                      });
                                                                                                                            })
                                                                                                                                );
                                                                                                                                    return;
                                                                                                                                      }

                                                                                                                                        /* ملفات الموقع نفسها — كاش أولًا */
                                                                                                                                          e.respondWith(
                                                                                                                                              caches.match(e.request).then(function(hit){
                                                                                                                                                    return hit||fetch(e.request).then(function(res){
                                                                                                                                                            if(res&&res.ok){
                                                                                                                                                                      var cl=res.clone();
                                                                                                                                                                                caches.open(CACHE).then(function(c){c.put(e.request,cl);});
                                                                                                                                                                                        }
                                                                                                                                                                                                return res;
                                                                                                                                                                                                      }).catch(function(){
                                                                                                                                                                                                              if(e.request.mode==='navigate')return caches.match('./index.html');
                                                                                                                                                                                                                    });
                                                                                                                                                                                                                        })
                                                                                                                                                                                                                          );
                                                                                                                                                                                                                          }) 