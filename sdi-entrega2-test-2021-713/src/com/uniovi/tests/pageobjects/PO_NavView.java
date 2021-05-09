package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_NavView extends PO_View {

    /**
     * CLicka una de las opciones principales (a href) y comprueba que se vaya a
     * la vista con el elemento de tipo type con el texto Destino
     * 
     * @param driver:       apuntando al navegador abierto actualmente.
     * @param textOption:   Texto de la opción principal.
     * @param criterio:     "id" or "class" or "text" or "@attribute" or "free".
     *                      Si el valor de criterio es free es una expresion
     *                      xpath completa.
     * @param textoDestino: texto correspondiente a la búsqueda de la página
     *                      destino.
     */
    public static void clickOption(WebDriver driver, String textOption,
            String criterio, String textoDestino) {
        // CLickamos en la opción de registro y esperamos a que se cargue el
        // enlace de Registro.
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "@href", textOption, getTimeout());
        // Tiene que haber un sólo elemento.
        assertTrue(elementos.size() == 1);
        // Ahora lo clickamos
        elementos.get(0).click();
        // Esperamos a que sea visible un elemento concreto
        elementos = SeleniumUtils.EsperaCargaPagina(driver, criterio,
                textoDestino, getTimeout());
        // Tiene que haber un sólo elemento.
        assertTrue(elementos.size() == 1);
    }

    /**
     * Versión simplificada de la opción de pulsar el menu
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param string elemento del menu
     */
    public static void clickMenuOption(WebDriver driver, String string) {
        List<WebElement> elementos = PO_View.checkElement(driver, "free",
                "//li[contains(@id, 'mMisOfertas')]/a");
        elementos.get(0).click();
        if (string.equals("add")) {
            elementos = PO_View.checkElement(driver, "free",
                    "//a[contains(@href, '/ofertas/agregar')]");
        } else if (string.equals("my-product")) {
            elementos = PO_View.checkElement(driver, "free",
                    "//a[contains(@href, '/ofertas/mis-ofertas')]");
        }
        elementos.get(0).click();
    }

}
