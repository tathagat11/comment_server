(function(window){
    // 'use strict';
    cacheManager = () => {
      return {
        open:openCacheInstance,
        get:getCacheInstanceKey,
        put:putCacheInstanceKey,
        clear:deleteInstance,
        delete:deleteInstanceKey
      }
    }

    const openCacheInstance = async (instance) => {
        return await caches.open(instance);
    }

    const getCacheInstanceKey = async (instance, key) => {
        try{
            const cacheStorage   = await openCacheInstance(instance);
            if(!cacheStorage)
                return null;
            const cachedResponse = await cacheStorage.match(key);
            if (!cachedResponse || !cachedResponse.ok ) {
                return null;
            }
            return await cachedResponse.json();
        }catch{return null;}
    }

    const putCacheInstanceKey = async (instance, key, Data) => {
        try{
            const cacheStorage = await openCacheInstance(instance); 
            if(!cacheStorage)
                return null;
            const jsonResponse = new Response(JSON.stringify(Data), {
                                    headers: {
                                            'content-type': 'application/json'
                                    }
                                });
            var res=await cacheStorage.put(key, jsonResponse);
            return res;
        }catch{return null;}
    }

    const deleteInstance = async (instance) => {
        try{
            const keys = await caches.keys();
            for ( const key of keys ){
                if ( instance === key  ){
                    await caches.delete( key );
                    return true;
                }
            }
        }catch{return null;}
    }

    const deleteInstanceKey = async (instance, key) => {
        try{
            const cacheStorage = await openCacheInstance(instance); 
            if(!cacheStorage)
                return null;
            await cacheStorage.delete(key);
            return true;
        }catch{return null;}
    }
  
    if(typeof(window._cacheManager) === 'undefined') window._cacheManager = cacheManager();

  })(window);