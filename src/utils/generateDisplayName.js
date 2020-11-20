
module.exports = (parent, helpers) => {
    return parent.name.toLowerCase() + '-' + parent.surname.toLowerCase();
};