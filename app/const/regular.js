const REGULAR = {
    EMAIL: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/,
    MOBILE: /1\d{10}$/,
    /** 字母开头，允许5-16字节，允许字母数字下划线 */
    USERNAME: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
}
export default REGULAR;