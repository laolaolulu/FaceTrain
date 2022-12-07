export const downfile = (url: string) => {
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'blob';
  console.log(url);
  request.onload = function (e: any) {
    console.log(e);
    const anchor = document.createElement('a');
    anchor.href = e.target.response;
    anchor.setAttribute('download', url.split('/').at(-1) || 'download');
    //  anchor.className = 'download-js-link';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    setTimeout(function () {
      anchor.click();
      document.body.removeChild(anchor);
    }, 66);
  };
  request.send();
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
