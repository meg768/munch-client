import React from 'react';

function Tag(props)  {
    const {tag : TheTag, children, ...other} = props;

    return (
        <TheTag {...other}>
            {children}
        </TheTag>
    );
}

export default Tag;
