// 返回随机整数
export function random_digit(min, max) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min )
} 
// 数组洗牌
// 为了不修改原数组，需要对原数组的副本进行操作
export function shuffle(arr) {
	let _arr = arr.slice()
	for (let i = 0; i < _arr.length - 1; i++) {
		let j = random_digit( 0, i )
		let mid = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = mid
	}
	return _arr
}

// 截流函数
export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
