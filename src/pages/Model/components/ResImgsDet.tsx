import { LoadingOutlined } from '@ant-design/icons';
import { Badge, Carousel, Empty, Image } from 'antd';

export default (props: { model: DetectionModel | undefined }) => {
  const Content = ({ model }: { model: DetectionModel }) => (
    <Badge.Ribbon
      placement="start"
      text={`${(model.time / 1000)?.toFixed(2)} s`}
      color={model.faces.length === 0 ? 'red' : 'green'}
      style={{ top: -10 }}
    >
      {model.faces.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{
            backgroundColor: '#fcecec',
            margin: 0,
            padding: 5,
          }}
        />
      ) : (
        <Image.PreviewGroup>
          <Carousel
            infinite={false}
            draggable={true}
            // autoplay={true}
            dots={{ className: 'dotclass' }}
            style={{
              display: 'grid',
              maxHeight: 100,
              maxWidth: 80,
              background: '#364d79',
            }}
          >
            {model.faces.map((m, index) => (
              <Image
                key={`${index}-${model.index}`}
                width={80}
                height={80}
                src={m.face}
              />
            ))}
          </Carousel>
        </Image.PreviewGroup>
      )}
    </Badge.Ribbon>
  );

  return (
    <div
      style={{
        width: 80,
        margin: '0 auto',
        marginTop: props.model && props.model.faces.length > 1 ? 0 : 15,
      }}
    >
      {props.model ? (
        props.model.faces.length > 1 ? (
          <Badge count={props.model.faces.length}>
            <Content model={props.model} />
          </Badge>
        ) : (
          <Content model={props.model} />
        )
      ) : (
        <LoadingOutlined />
      )}
    </div>
  );
};
