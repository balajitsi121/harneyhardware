define(["cookie"], function (Cookie) {

  var storage_key = "shopify-theme-history";
  var max = 10;

  return {
    get all() {
      var cookie = Cookie.get(storage_key);
      return cookie ? cookie.split(",") : [];
    },
    set all(urls) {
      Cookie.set(storage_key, urls.join(","), { path: "/" });
    },
    get previous_url() {
      return this.all[1];
    },
    get previous_collection_urls() {
      var collections = [];
      this.all.slice(1).forEach(function (url) {
        if ( url.match("/collections/") && !url.match("/products/") ) {
          collections.push(url);
        }
      });
      return collections;
    },
    get previous_product_urls() {
      var products = [];
      this.all.slice(1).forEach(function (url) {
        if ( url.match("/products/") ) {
          products.push(url);
        }
      });
      return products;
    },
    save: function (url) {
      var url = url.replace(/\/$/,"");
      var urls = this.all;

      if ( url == this.previous_page ) {
        return false;
      }

      if ( urls.length == max ) {
        urls.pop();
      }

      urls.unshift(url);

      this.all = urls;
    }
  };
});
