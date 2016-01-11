/**
 * Блокирует Яндекс-Советник на страницах вашего интернет-магазина
 * https://github.com/SerjoPepper/fuck_sovetnik
 * Если скрипт по каким то причинам перестал работать или что-то ломает на вашем сайте, пожалуйста, создайте тикет:
 * https://github.com/SerjoPepper/fuck_sovetnik/issues
 */

(function () {

  var observer;

  function init () {
    try {
      observer = new MutationObserver(check);
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
    observer.disconnect();
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
      if (isDiv(node) && (isYaBar(node) || hasSovetnikLink(node))) {
        remove(node);
        setTimeout(function () {remove(node);}, 500);
        stopObserve();
        observer = null;
      }
    });
  }

  // Скрываем яндекс-советник со страницы, возвращаем прежний margin-top для body
  function remove (node) {
    node.style.display = "none !important";
    node.setAttribute('style', 'display:none !important');
    document.documentElement.style.marginTop = 'initial';
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
    return node.querySelector('[href*="sovetnik.market.yandex.ru"]');
  }

  function getStyle (node, prop) {
    return window.getComputedStyle(node).getPropertyValue(prop);
  }

  init();

})();