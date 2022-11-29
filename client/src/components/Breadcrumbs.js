import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {Link} from "react-router-dom";

function BreadcrumbComponent({children}) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Home</Breadcrumb.Item>
      <Breadcrumb.Item active>{children}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;