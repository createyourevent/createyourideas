import { CalcProvider } from './mind-map-calc';
import { logger } from './config';
import { customizeFormat } from './customize-format';
import { MindMapModuleOpts } from './mind-map-main';
import { MIND_TYPE } from './constants';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'app/entities/user/user.model';

export class MindMapDataProvider {
  jm: any;
  calc: CalcProvider;
  translateService: TranslateService;

  constructor(jm, calc: CalcProvider, translateService: TranslateService) {
    this.jm = jm;
    this.calc = calc;
    this.translateService = translateService;
  }

  init() {
    logger.debug('data.init');
  }

  reset() {
    logger.debug('data.reset');
  }

  load(mindData, opts: MindMapModuleOpts, calc: CalcProvider): Promise<any> {
    return new Promise<any>(resolve => {
      let df = null;
      let mind = null;
      if (typeof mindData === 'object') {
        if (mindData.format) {
          df = mindData.format;
        } else {
          df = MIND_TYPE.NODE_TREE;
        }
      } else {
        df = MIND_TYPE.FREE_MIND;
      }
      customizeFormat.setSelectable(opts.selectable);

      if (df === MIND_TYPE.nodeArray) {
        mind = customizeFormat.nodeArray.getMind(mindData, calc, this.jm);
      } else if (df === MIND_TYPE.NODE_TREE) {
        mind = customizeFormat.nodeTree.getMind(mindData, calc, opts);
      } else if (df === MIND_TYPE.FREE_MIND) {
        mind = customizeFormat.freemind.getMind(mindData, calc);
      } else {
        logger.warn('unsupported format');
      }
      resolve(mind);
    });
  }

  getData(dataFormat) {
    let data = null;
    if (dataFormat === MIND_TYPE.nodeArray) {
      data = customizeFormat.nodeArray.getData(this.jm.mind);
    } else if (dataFormat === MIND_TYPE.NODE_TREE) {
      data = customizeFormat.nodeTree.getData(this.jm.mind);
    } else if (dataFormat === MIND_TYPE.FREE_MIND) {
      data = customizeFormat.freemind.getData(this.jm.mind);
    } else {
      logger.error('unsupported ' + dataFormat + ' format');
    }
    return data;
  }
}
