export const colors = [
  '#eb2f96',
  '#f5222d',
  '#fadb14',
  '#fa8c16',
  '#13c2c2',
  '#52c41a',
  '#1677ff',
  '#722ed1',
  '#2f54eb',
  '#eb2f96',
  '#fa541c',
  '#faad14',
  '#a0d911',
];

export const faceModel = {
  detection: [
    {
      value: 'Haarcascade',
      info: 'OpenCV',
      children: [
        {
          value: 'haarcascade_frontalface_alt2.xml',
          date: '2013-12-19',
          size: 837462,
        },
        {
          value: 'haarcascade_frontalface_default.xml',
          date: '2013-12-19',
          size: 1254733,
        },
        {
          value: 'haarcascade_frontalface_alt.xml',
          date: '2013-12-19',
          size: 919871,
        },
        {
          value: 'haarcascade_frontalface_alt_tree.xml',
          date: '2013-12-19',
          size: 3644763,
        },
      ],
    },
    {
      value: 'SSD',
      children: [
        {
          value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
          date: '2019-07-30',
          size: 5351047,
        },
      ],
    },
    {
      value: 'SCRFD',
      children: [
        //   {
        //     //value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
        //   },
      ],
    },
    {
      value: 'RetinaFace',
      children: [
        //   {
        //     value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
        //   },
      ],
    },
    {
      value: 'BlazeFace',
      children: [
        //   {
        //     value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
        //   },
      ],
    },
  ],
  recognition: [
    {
      value: 'OpenFace',
      children: [
        {
          value: 'nn4.v1.t7',
          date: '2016-01-20',
        },
        {
          value: 'nn4.v2.t7',
          date: '2016-01-20',
        },
        {
          value: 'nn4.small1.v1.t7',
          date: '2016-01-20',
        },
        {
          value: 'nn4.small2.v1.t7',
          date: '2016-01-20',
        },
      ],
    },
  ],
};
