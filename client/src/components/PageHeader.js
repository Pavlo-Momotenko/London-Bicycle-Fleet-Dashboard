import BreadcrumbComponent from "./Breadcrumbs";

function PageHeader({children}) {
    return (
        <>
            <h1>{children}</h1>
            <BreadcrumbComponent>{children}</BreadcrumbComponent>
        </>
    )
}

export default PageHeader;