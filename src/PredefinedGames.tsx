import {FC} from "react";
import {InitParams, useGameContext} from "./GameContext";

export const PredefinedGames: FC = () => {

    const {setInitParams} = useGameContext();

    return <div className="PredefinedGames">Готовые рецепты:&nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIAAaFFmUAA6tWylSyMjIw0FEqUbIyB9HlSlZKSjpKxRCqQMkquhokpxQA5AHVGuooJSpZmekolSpZpSXmFKfqKOUBZS8suLDhwqYLey92X9ipYAhUijDGoFYHYoIThG-io5QDFIXqm3Wx-WL7hV0XNgB1wRSSYJURWVYZkWOVMVlWGZNjlQlZVpmQY5UpWVaZkmOVGZpVsbUA_2_iLn4CAAA."))}>
            Сбалансированная система
        </button>
        &nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIAOSFFmUAA6tWylSyMjIw0FEqUbIyB9HlSlZKSjpKxRCqQMkquhokpxQA5IHU6iglKlkZAqlSJau0xJziVB2lPKD0hRkXtl_YeLH7YtOFfRfbL-y92H1hp4IhUA_CPINaHYhRThC-iY5SDlAUqn_WxWagvl0XNgB1wRSSY6cRWXYaUWSnMVl2GqPbaQi20wzDynkXNl9suLDhwt4LO4Bat4LoC1vJstKEIm-akmWnKUV2mqHZGVsLADGRp0GzAgAA"))}>
            Несбалансированная система
        </button>
        &nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIAMqFFmUAA6XRvYrCQBQF4FeRU08Rs-qyU26x9fbLFsKuIKgI_hUiSBQsrLQSC58hIsEfiM9w7xt5kihqCoukmcsw98w3wx2iDus6jkEX9j2qA1jAoJOUNuzPMDrDF3d92IpBE7Zo8BevLZ7IWnwJxVePLff4x8gkyc9kXzJowFKIM8uCjhnbylk9neDW-83e6EUGVd7P0oOtVRud_2tsJXvZ6lw95mYS6lyOheIT67xk1zph7iQ-U3lMN5Pp5jLfXpouuQd0QXQqgY7TJIdGkmNMiRvZxRMJ5UAxiKoEmX5ZyvXLciaznMuspMzf0QUjUIxCGAMAAA.."))}>
            Барабан-Буфер-Канат
        </button>
        &nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIABaGFmUAA6XRzWrCQBQF4FcJZz2LmKptZ9lF192XLoS2ULClYH8WIkhS6MJVuyouCr5BRII_EH2Fe9_IM4miRnCRbHIZ5p75MnO7eIINfN_gDfbc1U9YwKCTl1fY267bwzVXH7BNg2fYmsF99n3hjgwlllRiDdmyi1_2TJ68ytd1gzYshSzz62mfsbEsNdQI294b9ro_MmjxfJZ32MdWu_Owif3JVMY60JC5b0l1IHOvdsD6J9mhRswtJGaqihmUMoOieZabF0fmSCNZSaJ9T2bH_Ek8oLun_1D_cicVbU6PNudZoP9lko0mlRm9xFVJSl23XumJG6XMRiWzWTDvemvzcxlDIQMAAA.."))}>
            Барабан-Буфер-Канат с улучшением в избыточном ресурсе
        </button>
        &nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIAC6GFmUAA6XRvYrCQBQF4FeRU08RsyrslFtsvf2yhbAKgorgXyGCRMHCSiux8BkiEvyB-Az3vpEniaKmsEiauTPMPfPNMCM0YF3HMejBFp1oMoQFDLpJ6cD-jqJNfHM1gK0YtNhq8B-Pbe7IRnwJxVePLY_459gkya9kXTJowlKIM6uCThjbyUU9neLe-8Pe6EoGVZ7P0oetV5vd2i22loPsdKEec3MJdSGnQvGFdd6yG50ydxafqTymm8l0c5kfb02X3BO6JDqTQCdpkncjyW9MiVvZxz8SypFiEFUJMr2ylOuV5UxmOZdZSZl_4yvBQc2qGQMAAA.."))}>
            Барабан-Буфер-Канат с улучшением в ограничении
        </button>
        &nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIAIWGFmUAA6XRvWoCQRQF4FeRU0-xbtQkU6ZInT6kEJKAoCL4V4ggq2BhpZVY-AwrsvgD6zPc-0ae3VXULSx2m7kMc898M9wBarCu4xh0YF-j2ocFDNpJacF-D6IzfHLXg60YNGCLBr_x2uSJrMSXUHz12HKLvw9NkvxI9m8GdVgKcWZR0BFjGzmpp2Nce7_YG73IoMr7Wbqw_9V6--8SW8pONjpTj7mphDqTQ6H4wDpP2ZWOmTuKz1Qe081kurnMl6dmidwdOic6kUBHaZJDI8kxpsS1bOOJhLKnGERVgky_LOX6ZTmTWc5lVlLmz_AM4iwfjhgDAAA."))}>
            Барабан-Буфер-Канат с увеличенными буферами
        </button>
        &nbsp; &nbsp;
        <button
            onClick={event => setInitParams(InitParams.parse("H4sIALWGFmUAA6tWylSyMjIw0FEqUbIyB9HlSlZKSjpKxRCqQMkquhokpxQA5IHU6iglKlkZAqlSJau0xJziVB2lPKD0hRkXtl_YeLH7YtOFfRfbL-y92H1hp4IhUA_CPINaHYhRThC-iY5SjpKVGVT_rIvNQH27LmwA6oIpJMdOI7LsNKLITmO8dhoBQxVoKYgCmzARaGvLha0XG9DtNATbCXQcmpXzLmy-2HBhw4W9F3YArdwKoi9sJcKbMAsR3jShyJumZNlpSpGdZmh2xtYCANH3vv-zAgAA"))}>
            Канбан
        </button>
        &nbsp; &nbsp;
    </div>;
}