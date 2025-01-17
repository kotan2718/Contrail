
function changeType() {
    const type = String(document.getElementById('type').value);

    // 選択状態をローカルストレージに保存
    localStorage.setItem('selectedType', type);

}


