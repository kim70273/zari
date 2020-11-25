import { Link } from "react-router-dom";
import React, { Component } from "react";


const Reviews = ({ reviews, isStore }) => {

    return (
        <div>
            <Link
                to={{
                    pathname: "/",
                    state: {
                        reviews,
                    }
                }}
            >
                {isStore && (
                    <h3>
                        {reviews.UserEmail}: {reviews.UserComment}
                    </h3>
                )}

            </Link>
        </div>
    );
}

export default Reviews;