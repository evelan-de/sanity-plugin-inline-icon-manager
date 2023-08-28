import {SVGProps} from 'react'

interface DataUrlIconProps extends SVGProps<SVGSVGElement> {}

const DataUrlIcon = (props: DataUrlIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={props.width || 43}
    height={props.height || 23}
    viewBox='0 0 43 23'
    fill='none'
  >
    <path
      d='M0 9.625V0H6.875V1.375H8.25V2.75H9.625V6.875H8.25V8.25H6.875V9.625H0ZM2.75 8.25H5.5V6.875H6.875V2.75H5.5V1.375H2.75V8.25ZM11 9.625V2.75H12.375V1.375H13.75V0H17.875V1.375H19.25V2.75H20.625V9.625H17.875V6.875H13.75V9.625H11ZM13.75 5.5H17.875V2.75H16.5V1.375H15.125V2.75H13.75V5.5ZM26.125 9.625V1.375H23.375V0H31.625V1.375H28.875V9.625H26.125ZM33 9.625V2.75H34.375V1.375H35.75V0H39.875V1.375H41.25V2.75H42.625V9.625H39.875V6.875H35.75V9.625H33ZM35.75 5.5H39.875V2.75H38.5V1.375H37.125V2.75H35.75V5.5ZM6.875 22.625V21.25H5.5V13H8.25V21.25H12.375V13H15.125V21.25H13.75V22.625H6.875ZM16.5 22.625V13H24.75V14.375H26.125V18.5H23.375V19.875H24.75V21.25H26.125V22.625H22V21.25H20.625V19.875H19.25V22.625H16.5ZM19.25 18.5H22V17.125H23.375V14.375H19.25V18.5ZM28.875 22.625V13H31.625V21.25H37.125V22.625H28.875Z'
      fill='currentColor'
    />
  </svg>
)

export default DataUrlIcon
