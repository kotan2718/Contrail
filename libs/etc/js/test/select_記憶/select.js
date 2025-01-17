
document.addEventListener('DOMContentLoaded', (event) => {
    // ローカルストレージから選択状態を取得
    const selectedValue = localStorage.getItem('selectedType');
    if (selectedValue) {
        document.getElementById('type').value = selectedValue;
    }
});


