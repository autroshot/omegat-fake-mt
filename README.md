# OmegaT FakeMT Server

[OmegaT FakeMT plugin](https://github.com/briacp/omegat-plugin-fake-mt)의 서버를 기반으로 만들었습니다. 해당 플러그인에 대응하는 서버로 OmegaT와 번역 API(구글과 네이버 파파고)를 연결하는 역할을 합니다.

네이버 번역 API는 텍스트에 태그가 포함되어 있으면 번역에 문제가 생깁니다. 따라서 네이버 번역 API로 보내지는 텍스트는 약간의 가공 후에 보내집니다. 텍스트에 포함된 모든 태그를 작은따옴표로 변경하는 가공입니다.

두 번역 API에서 받은 텍스트는 병합되어 OmegaT로 전송됩니다.

요청이 잘못되거나 문제가 생기면 번역 텍스트 대신 응답 코드와 오류 메시지를 전송합니다.