const spinner = ({ display = false }) => {
    return (
        display &&
        <div className='spinner-page container-fluid'>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default spinner