import { logger, $create, $document, $win } from './config';
import { MindMapNode } from './mind-map-node';

export const customizeUtil = {
  isNode(node) {
    return node instanceof MindMapNode;
  },
  ajax: {
    _xhr() {
      let xhr = null;
      if ($win.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        try {
          xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {logger.debug(e)}
      }
      return xhr;
    },
    _eurl(url) {
      return encodeURIComponent(url);
    },
    request(url, param, method, callback, failCallback?) {
      const a = customizeUtil.ajax;
      let p = null;
      const tmpParam = [];
      for (const k in param) {
        if(k)
          tmpParam.push(a._eurl(k) + '=' + a._eurl(param[k]));
      }
      if (tmpParam.length > 0) {
        p = tmpParam.join('&');
      }
      const xhr = a._xhr();
      if (!xhr) {
        return;
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 0) {
            if (typeof callback === 'function') {
              const data = customizeUtil.json.string2json(xhr.responseText);
              if (data != null) {
                callback(data);
              } else {
                callback(xhr.responseText);
              }
            }
          } else {
            if (typeof failCallback === 'function') {
              failCallback(xhr);
            } else {
              logger.error('xhr request failed.', xhr);
            }
          }
        }
      };
      method = method || 'GET';
      xhr.open(method, url, true);
      xhr.setRequestHeader('If-Modified-Since', '0');
      if (method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.send(p);
      } else {
        xhr.send();
      }
    },
    get(url, callback) {
      return customizeUtil.ajax.request(url, {}, 'GET', callback);
    },
    post(url, param, callback) {
      return customizeUtil.ajax.request(url, param, 'POST', callback);
    }
  },

  dom: {
    // target,eventType,handler
    addEvent(t, e, h) {
      if (t.addEventListener) {
        t.addEventListener(e, h, false);
      } else {
        t.attachEvent('on' + e, h);
      }
    }
  },

  canvas: {
    bezierto(ctx, x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1 + ((x2 - x1) * 2) / 3, y1, x1, y2, x2, y2);
      ctx.stroke();
    },
    bezier3Pto(ctx, x1, y1, x2, y2, x3, y3) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
      ctx.stroke();
    },
    lineto(ctx, x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    clear(ctx, x, y, w, h) {
      ctx.clearRect(x, y, w, h);
    }
  },

  file: {
    read(fileData, fnCallback) {
      const reader = new FileReader();
      reader.onload = function() {
        if (typeof fnCallback === 'function') {
          fnCallback(this.result, fileData.name);
        }
      };
      reader.readAsText(fileData);
    },

    save(fileData, type, name) {
      let blob;
      if (typeof $win.Blob === 'function') {
        blob = new Blob([fileData], { type });
      } else {
        const BlobBuilder = $win.BlobBuilder || $win.MozBlobBuilder || $win.WebKitBlobBuilder || $win.MSBlobBuilder;
        const bb = new BlobBuilder();
        bb.append(fileData);
        blob = bb.getBlob(type);
      }
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
      } else {
        const URL = $win.URL || $win.webkitURL;
        const bloburl = URL.createObjectURL(blob);
        const anchor = $create('a');
        if ('download' in anchor) {
          anchor.style.visibility = 'hidden';
          anchor.href = bloburl;
          anchor.download = name;
          $document.body.appendChild(anchor);
          const evt = $document.createEvent('MouseEvents');
          evt.initEvent('click', true, true);
          anchor.dispatchEvent(evt);
          $document.body.removeChild(anchor);
        } else {
          location.href = bloburl;
        }
      }
    }
  },

  json: {
    json2string(json) {
      if (JSON) {
        try {
          const jsonStr = JSON.stringify(json);
          return jsonStr;
        } catch (e) {
          logger.warn(e);
          logger.warn('can not convert to string');
          return null;
        }
      }
    },
    string2json(jsonStr) {
      if (JSON) {
        try {
          const json = JSON.parse(jsonStr);
          return json;
        } catch (e) {
          logger.warn(e);
          logger.warn('can not parse to json');
          return null;
        }
      }
    },
    merge(b, a) {
      for (const o in a) {
        if (o in b) {
          if (typeof b[o] === 'object' && Object.prototype.toString.call(b[o]).toLowerCase() === '[object object]' && !b[o].length) {
            customizeUtil.json.merge(b[o], a[o]);
          } else {
            b[o] = a[o];
          }
        } else {
          b[o] = a[o];
        }
      }
      return b;
    }
  },

  uuid: {
    newid() {
      return (
        new Date().getTime().toString(16) +
        Math.random()
          .toString(16)
          .substr(2)
      ).substr(2, 16);
    }
  },

  text: {
    isEmpty(s) {
      if (!s) {
        return true;
      }
      return s.replace(/\s*/, '').length === 0;
    }
  }
};
