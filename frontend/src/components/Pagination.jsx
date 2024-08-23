import React from 'react';

const Pagination = ({ totalBlogs, blogsPerPage, currentPage, paginate }) => {
    const totalPages = Math.ceil(totalBlogs / blogsPerPage);

    // Function to generate the pagination items with ellipsis
    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex justify-center mt-4 join">
            <div className="inline-flex items-center bg-purple-400 text-white rounded-full mb-16 mt-5">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`join-item border-none btn btn-outline text-white hover:bg-purple-400 hover:text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                >
                    Previous page
                </button>
                {renderPageNumbers().map((number, index) => (
                    typeof number === 'string' ? (
                        <button key={index} className="join-item border-none btn hover:bg-purple-400 hover:text-white btn-disabled text-white">{number}</button>
                    ) : (
                        <button 
                            key={number} 
                            onClick={() => paginate(number)} 
                            className={`join-item border-none hover:bg-purple-400 hover:text-white btn ${currentPage === number ? 'bg-purple-300' : 'bg-purple-400'} text-white rounded-full`}>
                            {number}
                        </button>
                    )
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    className={`join-item border-none btn hover:bg-purple-400 hover:text-white btn-outline text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default Pagination;
