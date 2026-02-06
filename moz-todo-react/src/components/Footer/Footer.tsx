import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <h2 className="section-title">CONTACT</h2>

            <div className="footer__container">
                <div className="footer__info">
                    <p className="footer__text">テキストテキストテキスト</p>
                    <p className="footer__text">
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                    </p>
                    <p className="footer__text">
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                    </p>
                </div>

                <form className="footer__form">
                    <div className="footer__field">
                        <label className="footer__label" htmlFor="name">Name:</label>
                        <input id="name" className="footer__input footer__input--sm" type="text" />
                    </div>
                    <div className="footer__field">
                        <label className="footer__label" htmlFor="mail">Mail:</label>
                        <input id="mail" className="footer__input footer__input--sm" type="text" />
                    </div>
                    <div className="footer__field">
                        <label className="footer__label" htmlFor="message">Message:</label>
                        <textarea id="message" className="footer__input footer__input--lg" rows={5} />
                    </div>
                    <button className="footer__button" type="submit">SEND</button>
                </form>
            </div>

            <p className="footer__copy">@Sneakers</p>
        </footer>
    );
};

export default Footer;