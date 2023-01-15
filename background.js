let mode
const title = ['closed', 'normal', 'enhanced']
const icon = ['images/grey.png', 'images/red.png', 'images/blue.png']

const rule126 = {
  id: 1,
  condition: {
    regexFilter: 'm\\d+c\\.music\\.126\\.net',
  },
  action: {
    type: "modifyHeaders",
    requestHeaders: [{
      header: 'Cache-Control',
      operation: 'set',
      value: 'no-cache',
    }],
  },
};

const rule163 = {
  id: 2,
  condition: {
    requestDomains: ['music.163.com'],
  },
  action: {
    type: "modifyHeaders",
    requestHeaders: [{
      header: 'X-Real-IP',
      operation: 'set',
      value: '211.161.244.70',
    }],
  },
};

const sync = () => {
  if (mode > 0) {
    setRule(rule163);
  } else {
    removeRule(rule163.id);
  }
  chrome.storage.local.set({ mode })
  chrome.action.setIcon({ path: icon[mode] })
  chrome.action.setTitle({ title: `${chrome.i18n.getMessage('name')} [${chrome.i18n.getMessage(title[mode])}]` })
}

chrome.action.onClicked.addListener(() => {
  mode = (mode + 1) % 3
  sync()
})

chrome.storage.local.get('mode', data => {
  mode = data.mode == null ? 2 : data.mode
  sync()
})

async function setRule(addRule) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  if (existingRules.find(r => r.id === addRule.id)) {
    await removeRule(addRule.id);
  }
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [addRule],
  });
}

function removeRule(id) {
  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
  });
}

setRule(rule126);
