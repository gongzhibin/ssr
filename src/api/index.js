function fetchItem(id) {
    return new Promise((resolve, reject) => {
        console.log(id);
        resolve({ item: 'test' });
    });
}
export default fetchItem;
export { fetchItem };
