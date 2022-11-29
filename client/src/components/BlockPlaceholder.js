import './BlockPlaceholder.css';

function BlockPlaceholder({children}) {

    return (
        <div className={"block-placeholder"}>
            <p>{children}</p>
        </div>
    )
}

export default BlockPlaceholder;