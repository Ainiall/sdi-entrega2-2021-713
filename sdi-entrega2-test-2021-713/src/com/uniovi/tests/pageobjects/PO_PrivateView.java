package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_PrivateView extends PO_NavView {

    /**
     * Rellena el formulario de búsqueda
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param textp  texto a buscar
     */
    static public void fillFormSearch(WebDriver driver, String textp) {
        // Rellenemos el campo dedescripción
        WebElement text = driver.findElement(By.id("busqueda"));
        text.click();
        text.clear();
        text.sendKeys(textp);

        By boton = By.id("btn-buscar");
        driver.findElement(boton).click();
    }

    /**
     * Elimina una oferta de la fila especificada
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param fila   fila a borrar
     * @param titulo titulo de la oferta eliminada
     */
    public static void borrarOferta(WebDriver driver, int fila, String titulo) {
        PO_View.checkElement(driver, "free",
                "/html/body/div/div/table/tbody/tr[" + fila + "]/td[4]/a");
        driver.findElement((By.xpath(
                "/html/body/div/div/table/tbody/tr[" + fila + "]/td[4]/a")))
                .click();
        // comprobamos que ya no sale en el listado
        SeleniumUtils.textoNoPresentePagina(driver, titulo);
    }

    /**
     * Realiza una compra y muestra la alerta correspondiente
     * 
     * @param driver     apuntando al navegador abierto actualmente
     * @param antiguo    substring final del precio antiguo mostrado
     * @param nuevo      substring final del nuevo precio mostrado
     * @param mensaje    mensaje de alerta a mostrar
     * @param saldoFinal saldo final esperado
     */
    public static void compra(WebDriver driver, int antiguo, int nuevo,
            String mensaje, double saldoFinal) {
        // saldo anterior
        PO_View.checkElement(driver, "id", "dinero");
        Double saldoAntiguo = Double.parseDouble(driver
                .findElement(By.id("dinero")).getText().substring(0, antiguo));
        PO_PrivateView.buy(driver);
        PO_View.alerta(driver, mensaje);
        // comprobamos que aparece el nuevo saldo
        PO_View.checkElement(driver, "id", "dinero");
        Double nuevoSaldo = Double.parseDouble(driver
                .findElement(By.id("dinero")).getText().substring(0, nuevo));
        assertTrue(saldoAntiguo != nuevoSaldo);
        // deberia ser...
        assertTrue(nuevoSaldo == saldoFinal);
    }

    /**
     * Pulsa el botón de comprar
     */
    public static void buy(WebDriver driver) {
        List<WebElement> elementos = PO_View.checkElement(driver, "free",
                "//td/following-sibling::*/a[contains(@href, '/ofertas/comprar')]");
        elementos.get(0).click();
    }

}