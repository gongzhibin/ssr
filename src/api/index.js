function fetchItem(id) {
    return new Promise((resolve, reject) => {
        resolve({ title: 'item' });
    });
}
export default fetchItem;
export { fetchItem };
