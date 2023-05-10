import axios from 'axios';
import qs from 'qs';
import { NaverClient } from './types';

export function fetchTranslation(text: string, client: NaverClient) {
  return axios<NaverAPIResponseData>({
    method: 'post',
    url: 'https://openapi.naver.com/v1/papago/n2mt',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-Naver-Client-Id': client.id,
      'X-Naver-Client-Secret': client.secret,
    },
    data: qs.stringify({
      source: 'en',
      target: 'ko',
      text: text,
    }),
  });
}

interface NaverAPIResponseData {
  message: {
    result: {
      srcLangType: 'ko';
      tarLangType: 'en';
      translatedText: string;
    };
  };
}
