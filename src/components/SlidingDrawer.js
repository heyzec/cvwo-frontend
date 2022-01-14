import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import Button from 'material/Button'
import 'components/SlidingDrawer.css'

const SlidingDrawer = ({ drawer1, drawer2, label1, label2, nextPage, changePageClicked }) => {
  return (
    <div className="slider">
      <div className={`slider__page1${nextPage ? " slider--active" : ""}`}>
        <div className="slider__button-wrapper">
          <Button variant="outlined" onClick={changePageClicked}>
            <BsChevronLeft />
            {label1}
          </Button>
        </div>
        {drawer1}
      </div>
      <div className={`slider__page2${nextPage ? " slider--active" : ""}`}>
        <div className="slider__button-wrapper">
          <Button variant="outlined" onClick={changePageClicked}>
            {label2}
            <BsChevronRight />
          </Button>
        </div>
        {drawer2}
      </div>
    </div>
  )
}
export default SlidingDrawer
