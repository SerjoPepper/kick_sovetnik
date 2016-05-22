/**
 * Блокирует Яндекс-Советник на страницах вашего интернет-магазина
 * https://github.com/SerjoPepper/kick_sovetnik
 * Если скрипт по каким то причинам перестал работать или что-то ломает на вашем сайте, пожалуйста, создайте тикет:
 * https://github.com/SerjoPepper/kick_sovetnik/issues
 */

(function () {

  var observer;

  function init () {
    try {
      observer = new MutationObserver(function (records) {
        check(records);
      });
    } catch (e) {

    }
    if (document.body) {
      checkNodes(document.body.children);
    }
  }

  function startObserve () {
    if (!document.body) {
      setTimeout(startObserve, 200);
      return;
    }
    if (observer) {
      observer.observe(document.body, {childList: true});
    }
  }

  function stopObserve () {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Проверки
  function check (records) {
    records.forEach(function (record) {
      var addedNodes = record.addedNodes;
      if (addedNodes && addedNodes.length) {
        checkNodes(addedNodes);
      }
    });
  }

  function checkNodes (nodes) {
    Array.prototype.slice.call(nodes).forEach(function (node) {
      if (isDiv(node) && (hasSovetnikLink(node) || isYaBar(node))) {
        remove(node);
        stopObserve();
      }
    });
  }

  // Скрываем яндекс-советник со страницы, возвращаем прежний margin-top для body
  function remove (node) {
    var style = node.style;
    style.zIndex = '-9999';
    style.webkitTransform =
    style.MozTransform =
    style.msTransform =
    style.OTransform =
    style.transform = 'translate(-9999px, -9999px)';
    // следим в течении 3 сек за изменением marginTop у html
    var marginObserver = new MutationObserver(function () {
      var marginTop = document.documentElement.style.marginTop;
      if (marginTop && parseInt(marginTop, 10) !== 0) {
        document.documentElement.style.marginTop = '';
      }
    });
    setTimeout(function () {
      marginObserver.disconnect();
      marginObserver = null;
    }, 5e3);
    marginObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['style']});
    document.documentElement.style.marginTop = '';
  }

  // Определяем по косвенным признакам, что этот элемент - Яндекс-Советник
  function isYaBar (node) {
    return getStyle(node, 'background-color') === 'rgb(250, 223, 118)' &&
      getStyle(node, 'position') === 'fixed' &&
      getStyle(node, 'display') === 'table';
  }

  function isDiv (node) {
    return node.tagName === 'DIV';
  }

  function hasSovetnikLink (node) {
    return !!node.querySelector('[href*="sovetnik.market.yandex.ru"]');
  }

  function getStyle (node, prop) {
    return window.getComputedStyle(node).getPropertyValue(prop);
  }

  init();
  startObserve();
  setTimeout(stopObserve, 15e3);

})();
