module.exports = (errors) => {
    const output = {};
    if (errors.inner) {
        for (const e of errors.inner) {
            output[e.path] = e.errors;
        }
    }
    return output;
};
