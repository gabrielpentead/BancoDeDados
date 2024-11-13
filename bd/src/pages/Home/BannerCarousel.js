import { Carousel } from 'react-bootstrap';
import PropTypes from 'prop-types';

function BannerCarousel({ activeIndex, onSelect }) {
  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-center">
          <Carousel activeIndex={activeIndex} onSelect={onSelect} interval={3000}>
            <Carousel.Item>
              <img src="baners/1.png" className="d-block" alt="I" width="100%"  />
            </Carousel.Item>
            <Carousel.Item>
              <img src="baners/2.png" className="d-block" alt="II" width="100%"  />
            </Carousel.Item>
            <Carousel.Item>
              <img src="baners/3.png" className="d-block" alt="III" width="100%"  />
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

BannerCarousel.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default BannerCarousel;
