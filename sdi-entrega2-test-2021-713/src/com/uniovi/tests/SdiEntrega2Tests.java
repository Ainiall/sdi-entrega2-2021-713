package com.uniovi.tests;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

//Paquetes Java
import java.util.List;

//Paquetes JUnit 
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
//Paquetes Selenium 
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

//Paquetes con los Page Object
import com.uniovi.tests.pageobjects.PO_AddOfferView;
import com.uniovi.tests.pageobjects.PO_AdminView;
import com.uniovi.tests.pageobjects.PO_ChatView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PrivateView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
//Paquetes Utilidades de Testing Propias
import com.uniovi.tests.util.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SdiEntrega2Tests {
    // En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens
    // automáticas)):
    // static String PathFirefox65 = "C:\\Program Files\\Mozilla
    // Firefox\\firefox.exe";
    // static String Geckdriver024 = "C:\\Path\\geckodriver024win64.exe";
    // En MACOSX (Debe ser la versión 65.0.1 y desactivar las actualizacioens
    // automáticas):
    static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
    // static String PathFirefox64 =
    // "/Applications/Firefox.app/Contents/MacOS/firefox-bin";
    static String Geckdriver024 = "lib\\geckodriver024win64.exe";
    // static String Geckdriver022 =
    // "/Users/delacal/Documents/SDI1718/firefox/geckodriver023mac";
    // Común a Windows y a MACOSX
    static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
    static String URL = "https://localhost:8081";

    public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckdriver);
        WebDriver driver = new FirefoxDriver();
        return driver;
    }

    // Antes de cada prueba
    @Before
    public void setUp() {
        // reseteo de la base de datos
        driver.navigate().to(URL + "/test");
        PO_View.checkElement(driver, "text", "Cargando datos en MongoDB...");
        driver.navigate().to(URL);
    }

    // Después de cada prueba
    @After
    public void tearDown() {
        driver.manage().deleteAllCookies();
    }

    // Configuramos las pruebas.
    @BeforeClass
    static public void begin() {
        // Fijamos el timeout en cada opción de carga de una vista. 2 segundos.
        PO_View.setTimeout(3);

    }

    @AfterClass
    static public void end() {
        // Cerramos el navegador al finalizar las pruebas
        driver.quit();
    }

    // PR01. Registro de Usuario con datos válidos.
    @Test
    public void PR01() {
        // registro e inicio de sesión
        PO_RegisterView.signup(driver, "test1@test.com", "Prueba", "Test1",
                "12345678", "12345678");
        // elemento unico de la vista /home de usuario
        assertNotNull(PO_View.checkElement(driver, "id", "ofertas"));
    }

    // PR02. Registro de Usuario con datos inválidos (email, nombre y apellidos
    // vacíos).
    @Test
    public void PR02() {
        // registro inválido
        PO_RegisterView.signup(driver, "", "", "", "12345678", "12345678");
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");

    }

    // PR03. Registro de Usuario con datos inválidos (repetición de contraseña
    // inválida).
    @Test
    public void PR03() {
        // registro inválido
        PO_RegisterView.signup(driver, "test3@test.com", "Prueba", "Test2",
                "12345678", "1234567890");
        PO_View.alerta(driver, "Las contraseñas deben coincidir");
    }

    // PR04. Registro de Usuario con datos inválidos (email existente).
    @Test
    public void PR04() {
        // registro inválido
        PO_RegisterView.signup(driver, "test4@email.com", "Prueba", "Test4",
                "12345678", "12345678");
        PO_View.alerta(driver, "Ya existe un usuario con ese email");
    }

    // PR05. Inicio de sesión con datos válidos.
    @Test
    public void PR05() {
        // inicio correcto
        PO_LoginView.login(driver, "admin@email.com", "admin");
        // aparece la pagina principal de administrador
        assertNotNull(PO_View.checkElement(driver, "id", "admin"));
    }

    // PR06. Inicio de sesión con datos inválidos (email existente,pero
    // contraseña incorrecta).
    @Test
    public void PR06() {
        // inicio incorrecto
        PO_LoginView.login(driver, "test2@email.com", "admin");
        PO_View.alerta(driver, "Email o password incorrecto");
    }

    // PR07. Inicio de sesión con datos inválidos (campo email o contraseña
    // vacíos).
    @Test
    public void PR07() {
        // inicio incorrecto
        PO_LoginView.login(driver, "", "admin");
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");
        // login incorrecto
        PO_LoginView.login(driver, "test1@email.com", "");
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");
    }

    // PR08. Inicio de sesión con datos inválidos (email no existente en la
    // aplicación).
    @Test
    public void PR08() {
        // inicio incorrecto
        PO_LoginView.login(driver, "email@inexistente.com", "12345678");
        PO_View.alerta(driver, "Email o password incorrecto");
    }

    // PR09. Hacer click en la opción de salir de sesión y comprobar que se
    // redirige a la página de inicio de sesión(Login).
    @Test
    public void PR09() {
        // inicio correcto
        PO_LoginView.login(driver, "test1@email.com", "12345678");
        // muestra página principal de usuario
        assertNotNull(PO_View.checkElement(driver, "text", "Ofertas"));
        // desconexión
        PO_NavView.clickOption(driver, "desconectarse", "id",
                "identificacion-titulo");
        // vuelve al formulario de inicio de sesión
        assertNotNull(PO_View.checkElement(driver, "text",
                "Identificación de usuario"));
    }

    // PR10. Comprobarque el botón cerrar sesión no está visible si el usuario
    // no está autenticado.
    @Test
    public void PR10() {
        // inicio correcto
        PO_LoginView.login(driver, "test1@email.com", "12345678");
        // muestra página principal de usuario con el botón de desconectarse
        assertNotNull(PO_View.checkElement(driver, "text", "Ofertas"));
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "@href", "desconectarse", 1);
        assertTrue(elementos.size() == 1);
        // desconexión
        PO_NavView.clickOption(driver, "desconectarse", "id",
                "identificacion-titulo");
        // el boton de desconexión ya no está visible
        assertNotNull(PO_View.checkElement(driver, "text", "Identifícate"));
        // no se ve el de cerrar sesión
        SeleniumUtils.textoNoPresentePagina(driver, "Cierra sesión");
    }

    // PR11. Mostrar el listado de usuarios y comprobar que se muestran todos
    // los que existen en el sistema.
    @Test
    public void PR11() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // se muestran todos los usuarios de la base de pruebas
        assertNotNull(PO_View.checkElement(driver, "text", "test1@email.com"));
        assertNotNull(PO_View.checkElement(driver, "text", "test2@email.com"));
        assertNotNull(PO_View.checkElement(driver, "text", "test3@email.com"));
        assertNotNull(PO_View.checkElement(driver, "text", "test4@email.com"));
        assertNotNull(PO_View.checkElement(driver, "text", "test5@email.com"));
        assertNotNull(PO_View.checkElement(driver, "text", "test6@email.com"));
        assertNotNull(PO_View.checkElement(driver, "text", "test7@email.com"));
    }

    // PR12. Ir a la lista de usuarios,borrar el primer usuario de la
    // lista, comprobar que la lista se actualiza y dicho usuario desaparece.
    @Test
    public void PR12() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // click en el primer checkbox y lo borramos
        PO_AdminView.borrarCheckBox(driver, "cbtest1@email.com");
        // comprobamos que ya no está en la bbdd
        PO_AdminView.checkUsuarioEliminado(driver, "test1@email.com");

    }

    // PR13. Ir a la lista de usuarios,borrar el último usuario de la lista,
    // comprobar que la lista se actualizay dicho usuario desaparece.
    @Test
    public void PR13() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // click en el último checkbox y lo borramos
        PO_AdminView.borrarCheckBox(driver, "cbtest7@email.com");
        // comprobamos que ya no está en la bbdd ->desconexión
        PO_AdminView.checkUsuarioEliminado(driver, "test7@email.com");

    }

    // PR14. Ir a la lista deusuarios,borrar 3 usuarios, comprobar que la lista
    // se actualiza y dichos usuarios desaparecen.
    @Test
    public void PR14() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // comprobamos que existen las filas y las marcamos
        assertNotNull(PO_View.checkElement(driver, "id", "cbtest2@email.com"));
        driver.findElement(By.id("cbtest2@email.com")).click();
        assertNotNull(PO_View.checkElement(driver, "id", "cbtest3@email.com"));
        driver.findElement(By.id("cbtest3@email.com")).click();
        assertNotNull(PO_View.checkElement(driver, "id", "cbtest4@email.com"));
        driver.findElement(By.id("cbtest4@email.com")).click();
        // se borra
        assertNotNull(PO_View.checkElement(driver, "id", "btnDelete"));
        driver.findElement(By.id("btnDelete")).click();
        // ya no se ven
        SeleniumUtils.textoNoPresentePagina(driver, "test2@email.com");
        SeleniumUtils.textoNoPresentePagina(driver, "test3@email.com");
        SeleniumUtils.textoNoPresentePagina(driver, "test4@email.com");
        // comprobamos que ya no está en la bbdd ->desconexión
        PO_AdminView.checkUsuarioEliminado(driver, "test2@email.com");
        PO_LoginView.loginIncorrecto(driver, "test3@email.com");
        PO_LoginView.loginIncorrecto(driver, "test4@email.com");

    }

    // PR15. Ir al formulario de alta de oferta, rellenarla con datos válidos y
    // pulsar el botón Submit. Comprobar que la oferta sale en el listado de
    // ofertas de dicho usuario.
    @Test
    public void PR15() {
        // inicio correcto y acceso al menu de agregar oferta
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "add");
        // lo rellenamos con datos válidos
        PO_AddOfferView.fillForm(driver, "Mi producto de prueba #1",
                "Esta es una decripción de prueba", "15.43", false);
        // pagina mis ofertas
        assertNotNull(PO_View.checkElement(driver, "id", "mis-ofertas"));
        // comprobamos que aparecen en la lista
        assertNotNull(PO_View.checkElement(driver, "text",
                "Mi producto de prueba #1"));
    }

    // PR16. Ir al formulario dealta de oferta, rellenarla con datos inválidos
    // (campo título vacío y precio en negativo) y pulsar el botón Submit.
    // Comprobar que se muestra el mensaje de campo obligatorio.
    @Test
    public void PR16() {
        // inicio correcto y acceso al menu de agregar oferta
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "add");
        // lo rellenamos con datos inválidos
        PO_AddOfferView.fillForm(driver, "", "Esta es una decripción de prueba",
                "-87", false);
        // se muestra el error
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");
    }

    // PR017. Mostrar el listado de ofertas para dicho usuario y comprobar que
    // se muestran todas las que existen para este usuario
    @Test
    public void PR17() {
        // inicio correcto y acceso al menu de ofertas propias
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        // estamos en la pagina mis ofertas
        assertNotNull(PO_View.checkElement(driver, "id", "mis-ofertas"));
        // comprobamos que aparecen en la lista los de la BBDD
        assertNotNull(PO_View.checkElement(driver, "text", "Iphone 8 64"));
        assertNotNull(PO_View.checkElement(driver, "text", "Google Home"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Taburete con ruedas"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Producto para test"));
    }

    // PR18. Ir a la lista de ofertas, borrar la primera oferta de la lista,
    // comprobar que la lista se actualiza y que la oferta desaparece.
    @Test
    public void PR18() {
        // inicio correcto y acceso al menu de ofertas propias
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        // borrar oferta
        PO_PrivateView.borrarOferta(driver, 1, "Iphone 8 64");
        // comprobamos que la primera fila ya no tiene ese producto
        String text = driver
                .findElement(
                        By.xpath("/html/body/div/div/table/tbody/tr[1]/td[1]"))
                .getText();
        assertNotEquals("Ipone 8 64", text);
    }

    // PR19. Ir a la lista de ofertas, borrar la última oferta de la lista,
    // comprobar que la lista se actualiza y que laoferta desaparece.
    @Test(expected = NoSuchElementException.class)
    public void PR19() {
        // inicio correcto y acceso al menu de ofertas propias
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        // borrar oferta
        PO_PrivateView.borrarOferta(driver, 4, "Producto para test");
        // como ya no existe la cuarta fila debe lanzar una excepión
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[4]/td[1]"))
                .getText();
    }

    // P20. Hacer una búsqueda con el campo vacío ycomprobar que se
    // muestra la página que corresponde con el listado de las ofertas
    // existentes en el sistema
    @Test
    public void PR20() {
        // inicio correcto con búsqueda vacía
        PO_LoginView.loginUser5Busqueda(driver, "");
        // como la lista mantiene siempre el mismo orden, podemos comprobarlo
        // por título
        // debemos tener en cuenta que ya no existen las ofertas de los usuarios
        // eliminados
        assertNotNull(
                PO_View.checkElement(driver, "text", "Monitor 19 pulgadas"));
        assertNotNull(PO_View.checkElement(driver, "text", "Aparador"));
        assertNotNull(PO_View.checkElement(driver, "text", "TV Samsung"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Zapatillas converse"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Libro El Principito"));
    }

    // PR21. Hacer una búsqueda escribiendo en el campo un texto que no exista y
    // comprobar que se muestrala página que corresponde, con la listade ofertas
    // vacía.
    @Test
    public void PR21() {
        // inicio correcto con búsqueda que no existe
        PO_LoginView.loginUser5Busqueda(driver, "aaeeiioouu");
        // la lista debe estar vacia
        List<WebElement> elementos = driver
                .findElements(By.xpath("//table/tbody/td"));
        assertTrue(elementos.size() == 0);

    }

    // PR22. Hacer una búsqueda escribiendo en el campo un texto en minúscula o
    // mayúscula y comprobar que se muestra la página que corresponde, con la
    // lista de ofertas que contengan dicho texto, independientemente que el
    // título esté almacenado en minúsculas o mayúscula.
    @Test
    public void PR22() {
        // inicio correcto con búsqueda pulgadas/Pulgadas
        PO_LoginView.loginUser5Busqueda(driver, "pulgadas");
        // comprobamos que salen ambos resultados
        assertNotNull(
                PO_View.checkElement(driver, "text", "Monitor 19 pulgadas"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Monitor 27 pulgadas"));
        assertNotNull(PO_View.checkElement(driver, "text", "TV 43 Pulgadas"));
    }

    // PR23. Sobre una búsqueda determinada (a elección de desarrollador),
    // comprar una oferta que deja un saldo positivo en el contador del
    // comprobador.
    // Y comprobar que el contador se actualiza correctamente en la vista del
    // comprador
    @Test
    public void PR23() {
        // inicio correcto con búsqueda para compra válida
        PO_LoginView.loginUser5Busqueda(driver, "1984");
        // se realiza una compra válida (36.2 -> 28.7)
        // compra valida, substring (antiguo -> nuevo), mensaje, saldo final
        PO_PrivateView.compra(driver, 4, 4, "Oferta comprada", 28.7);

    }

    // PR24. Sobre una búsqueda determinada (a elección de desarrollador),
    // comprar una oferta que deja un saldo 0 en el contador del comprobador. Y
    // comprobar que el contador se actualiza correctamente en la vista del
    // comprador.
    @Test
    public void PR24() {
        // inicio correcto con búsqueda para compra precio justo
        PO_LoginView.loginUser5Busqueda(driver, "precio justo");
        // compra valida, substring 4, mensaje, saldo final;
        PO_PrivateView.compra(driver, 4, 2, "Oferta comprada", 0);
    }

    // PR25. Sobre una búsqueda determinada (a elección de desarrollador),
    // intentar comprar una oferta que esté por encima de saldo disponible del
    // comprador.
    // Y comprobar que semuestra el mensaje de saldo no suficiente.
    @Test
    public void PR25() {
        // inicio correcto
        PO_LoginView.login(driver, "test6@email.com", "12345678");
        // hacemos una búsqueda vacía
        PO_PrivateView.fillFormSearch(driver, "para test");
        // precio 160.5 -> 160.5
        PO_PrivateView.compra(driver, 5, 5, "Saldo insuficiente."
                + " No se puede comprar la oferta seleccionada", 160.5);

    }

    // PR26. Ir a la opción de ofertas compradas del usuario y mostrar la lista.
    // Comprobar que aparecen las ofertas que deben aparecer.
    @Test
    public void PR26() {
        // inicio correcto
        PO_LoginView.login(driver, "test5@email.com", "12345678");
        // comprobamos que existe y vamos a la ventana de compras
        assertNotNull(PO_View.checkElement(driver, "id", "mCompras"));
        driver.findElement(By.id("mCompras")).click();
        // comprobamos que aparecen las compras
        assertNotNull(PO_View.checkElement(driver, "id", "table"));
        assertNotNull(PO_View.checkElement(driver, "text", "TV Samsung"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Libros academia C2"));
    }

    // PR27. Al crear una oferta marcar dicha oferta como destacada y a
    // continuación comprobar: i) que aparece en el listado de ofertas
    // destacadas para los usuarios y que el saldo del usuario se actualiza
    // adecuadamente en la vista del ofertante (-20).
    @Test
    public void PR27() {
        // inicio correcto y ventana agregar oferta
        PO_LoginView.loginUserMenu(driver, "test6@email.com", "add");
        // lo rellenamos con datos válidos
        PO_AddOfferView.fillForm(driver, "Mi producto destacado",
                "descripción destacada", "5", true);
        assertNotNull(
                PO_View.checkElement(driver, "text", "Mi producto destacado"));
        // mensaje y saldo esperado, substring 5 160.5 140.5
        PO_PrivateView.ofertaDestacada(driver, "Oferta agregada", 5, 140.5);
        // comprobamos que se muestra como destacada para el resto de usuarios
        PO_PrivateView.comprobarDestacados(driver, "Mi producto destacado");
    }

    // PR28. Sobre el listado de ofertas de un usuario con másde 20 euros de
    // saldo, pinchar en el enlace Destacada y a continuación comprobar: i) que
    // aparece en el listadode ofertas destacadas para los usuarios y que el
    // saldo del usuario se actualiza adecuadamente en la vista del ofertante
    // (-20)
    @Test
    public void PR28() {
        // inicio correcto y ventana agregar oferta
        PO_LoginView.loginUserMenu(driver, "test6@email.com", "my-product");
        assertNotNull(PO_View.checkElement(driver, "id", "mis-ofertas"));
        // destacamos una oferta
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[2]/td[5]/a"))
                .click();
        // mensaje y saldo esperado, substring 5 160.5 -> 140.5
        PO_PrivateView.ofertaDestacada(driver, "Oferta destacada", 5, 140.5);
        // comprobamos que se muestra como destacada para el resto de usuarios
        PO_PrivateView.comprobarDestacados(driver, "TV 43 Pulgadas");
    }

    // PR029. Sobre el listado de ofertas de un usuario con menos de 20 euros de
    // saldo, pinchar en el enlace Destacada y a continuación comprobar que se
    // muestra el mensaje de saldo no suficiente.
    @Test
    public void PR29() {
        // inicio correcto y ventana agregar oferta
        PO_LoginView.loginUserMenu(driver, "test7@email.com", "my-product");
        assertNotNull(PO_View.checkElement(driver, "id", "mis-ofertas"));
        // destacamos una oferta
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[3]/td[5]/a"))
                .click();
        // mensaje y saldo esperado
        PO_PrivateView.ofertaDestacada(driver,
                "No tienes dinero suficiente para destacar una oferta (20€) ",
                4, 19.5);
    }

    // PR030. Inicio de sesión con datos válidos.
    @Test
    public void PR30() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
    }

    // PR031. Inicio de sesión con datos inválidos (email existente, pero
    // contraseña incorrecta).
    @Test
    public void PR31() {
        PO_LoginView.loginAPIincorrecto(driver, URL, "test6@email.com",
                "00000000000");
    }

    // PR032. Inicio de sesión con datos inválidos (campo email o contraseña
    // vacíos).
    @Test
    public void PR32() {
        PO_LoginView.loginAPIincorrecto(driver, URL, "", "12345678");
        PO_LoginView.loginAPIincorrecto(driver, URL, "test@email.com", "");
    }

    // PR033. Mostrar el listado de ofertas disponibles y comprobar que se
    // muestran todas las que existen, menos las del usuario identificado.
    @Test
    public void PR33() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
        // carga la tabla principal
        assertNotNull(PO_View.checkElement(driver, "id", "tablaCuerpo"));
        // comprobamos que se muestran todos los que existen en la bbdd menos
        // los del usuario 6
        assertNotNull(
                PO_View.checkElement(driver, "text", "Monitor 19 pulgadas"));
        assertNotNull(PO_View.checkElement(driver, "text", "Aparador"));
        assertNotNull(PO_View.checkElement(driver, "text", "TV Samsung"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Zapatillas converse"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Libro El Principito"));
        assertNotNull(PO_View.checkElement(driver, "text", "Mesita de noche"));
        assertNotNull(PO_View.checkElement(driver, "text", "Estuche Roxy"));
        assertNotNull(PO_View.checkElement(driver, "text", "La Biblia"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Libros academia C2"));
        assertNotNull(PO_View.checkElement(driver, "text", "Esterilla"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Mochila nevera playa"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Portatil Sony Vaio"));
        assertNotNull(PO_View.checkElement(driver, "text", "Iphone 8 64"));
        assertNotNull(PO_View.checkElement(driver, "text", "Google Home"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Taburete con ruedas"));
        assertNotNull(
                PO_View.checkElement(driver, "text", "Producto para test"));
        assertNotNull(PO_View.checkElement(driver, "text", "Pijama"));
        assertNotNull(PO_View.checkElement(driver, "text", "Patines en linea"));
        assertNotNull(PO_View.checkElement(driver, "text", "Libro 1984"));
        assertNotNull(PO_View.checkElement(driver, "text", "precio justo"));
        // no aparecen las del usuario 6
        SeleniumUtils.textoNoPresentePagina(driver, "Monitor 27 pulgadas");
        SeleniumUtils.textoNoPresentePagina(driver, "TV 43 Pulgadas");
        SeleniumUtils.textoNoPresentePagina(driver, "Flexo Ikea");
        // muestra el resto de ofertas disponibles (20)
        List<WebElement> elementos = driver
                .findElements(By.xpath("//*[@id=\"tablaCuerpo\"]/tr"));
        assertTrue(elementos.size() == 20);
    }

    // PR034. Sobre una búsqueda determinada de ofertas (a elección de
    // desarrollador), enviar un mensaje a una oferta concreta. Se abriría dicha
    // conversación por primera vez. Comprobar que el mensaje aparece en el
    // listado de mensajes
    @Test
    public void PR34() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
        // pulsamos en la primera oferta que siga el criterio de búsqueda para
        // ir a su chat
        PO_ChatView.chat(driver, "home");
        // comprobamos que el chat está vacío
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "id", "alertas", PO_View.getTimeout());
        assertTrue(elementos.size() == 1);
        // muestra el mensaje de error adecuado
        assertNotNull(PO_View.checkElement(driver, "text",
                "El chat está vacío.Envía un mensaje para comenzar la conversación"));
        // insertamos un mensaje
        PO_ChatView.fillForm(driver, "no crees que es un poco caro?");
        // comprobamos que se muestra
        assertNotNull(PO_View.checkElement(driver, "id", "chat"));
    }

    // PR035. Sobre el listado de conversaciones enviar un mensaje a una
    // conversación ya abierta. Comprobar que el mensaje aparece en el listado
    // de mensajes.
    @Test
    public void PR35() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
        // pulsamos en la primera oferta que siga el criterio de búsqueda para
        // ir a su chat
        PO_ChatView.chat(driver, "justo");
        // comprobamos que el chat no está vacío
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "free", "//*[@id=\"chat\"]/div", PO_View.getTimeout());
        assertTrue(elementos.size() == 4);
        // insertamos un mensaje
        PO_ChatView.fillForm(driver, "¿Sigue en pie la oferta?");
        // esperamos a que se muestre
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "text",
                "¿Sigue en pie la oferta?", PO_View.getTimeout());
        assertTrue(elementos.size() == 1);
        // ahora hay 5 mensajes en el chat
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
                "//*[@id=\"chat\"]/div", PO_View.getTimeout());
        assertTrue(elementos.size() == 5);

    }

    // PR036. Mostrar el listado de conversaciones ya abiertas. Comprobar que el
    // listado contiene las conversaciones que deben ser.
    @Test
    public void PR36() {
        // inicio API user7
        PO_LoginView.loginAPI(driver, URL, "test7@email.com");
        // comprobamos que existe el menú de chats y lo pulsamos
        assertNotNull(PO_View.checkElement(driver, "id", "barra-menu-chats"));
        driver.findElement(By.id("barra-menu-chats")).click();
        // comprobamos que hay 6 elementos en la tabla (2 interesado 4 vendedor)
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "free", "//*[@id=\"tablaChats\"]/tr", PO_View.getTimeout());
        assertTrue(elementos.size() == 6);
    }

    // PR037. Sobre el listado de conversaciones ya abiertas. Pinchar el enlace
    // Eliminar de la primera y comprobar que el listado se actualiza
    // correctamente
    @Test
    public void PR37() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test7@email.com");
        // comprobamos que existe el menú de chats y lo pulsamos
        assertNotNull(PO_View.checkElement(driver, "id", "barra-menu-chats"));
        driver.findElement(By.id("barra-menu-chats")).click();
        // comprobamos que hay 6 elementos en la tabla (2 interesado 4 vendedor)
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "free", "//*[@id=\"tablaChats\"]/tr", PO_View.getTimeout());
        assertTrue(elementos.size() == 6);
        // Y que el primero de ellos es Monitor 27 pulgadas
        String primero = driver
                .findElement(
                        By.xpath("/html/body/div/div/table/tbody/tr[1]/td[1]"))
                .getText();
        // pulsamos el primer elemento para eliminarlo
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[1]/td[5]/a"))
                .click();
        // esperamos hasta que se borre
        SeleniumUtils.EsperaCargaPaginaNoTexto(driver, primero,
                PO_View.getTimeout());
        // comprobamos que el primer elemento ya no es el mismo
        String primeroNuevo = driver
                .findElement(
                        By.xpath("/html/body/div/div/table/tbody/tr[1]/td[1]"))
                .getText();
        // comprobamos que ahora hay 1 elemento menos
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
                "//*[@id=\"tablaChats\"]/tr", PO_View.getTimeout());
        assertTrue(elementos.size() == 5);
        // y el texto es de la primera fila es distinto
        assertNotEquals(primero, primeroNuevo);

    }

    // PR038. Sobre el listado de conversaciones ya abiertas. Pinchar el enlace
    // Eliminar de la última y comprobar que el listado se actualiza
    // correctamente.
    @Test
    public void PR38() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
        // comprobamos que existe el menú de chats y lo pulsamos
        assertNotNull(PO_View.checkElement(driver, "id", "barra-menu-chats"));
        driver.findElement(By.id("barra-menu-chats")).click();
        // comprobamos que carga el listado de chats
        assertNotNull(PO_View.checkElement(driver, "id", "tablaChats"));
        // comprobamos que hay 5 elementos en la tabla (4 interesado 3 vendedor)
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "free", "//*[@id=\"tablaChats\"]/tr", PO_View.getTimeout());
        assertTrue(elementos.size() == 7);
        // Y que el primero de ellos es precio justo
        String ultimo = driver
                .findElement(By.xpath(
                        "/html/body/div/div/table/tbody/tr[last()]/td[1]"))
                .getText();
        // pulsamos el primer ultimo para eliminarlo
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[last()]/td[5]/a"))
                .click();
        // esperamos hasta que se borre
        SeleniumUtils.EsperaCargaPaginaNoTexto(driver, ultimo,
                PO_View.getTimeout());
        // comprobamos que ahora hay 1 elemento menos
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
                "//*[@id=\"tablaChats\"]/tr", PO_View.getTimeout());
        assertTrue(elementos.size() == 6);
    }

    // PR039. Identificarse en la aplicación y enviar un mensaje a una oferta,
    // validar que el mensaje enviado aparece en el chat. Identificarse después
    // con el usuario propietario de la oferta y validar que tiene un mensaje
    // sin leer, entrar en el chat y comprobar que el mensaje pasa a tener el
    // estado leído.
    @Test
    public void PR39() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
        // pulsamos en la primera oferta que siga el criterio de búsqueda para
        // ir a su chat
        PO_ChatView.chat(driver, "justo");
        // comprobamos que el chat no está vacío
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "free", "//*[@id=\"chat\"]/div", PO_View.getTimeout());
        assertTrue(elementos.size() == 4);
        // insertamos un mensaje y comprobamos que aparece
        PO_ChatView.insertarMensaje(driver, "¿Sigue en pie la oferta?");
        // ahora hay 5 mensajes en el chat
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
                "//*[@id=\"chat\"]/div", PO_View.getTimeout());
        assertTrue(elementos.size() == 5);
        // iniciamos sesión con el otro interlocutor y comprobamos que tiene 1
        // mensaje
        PO_View.comprobacionNotificaciones(driver, URL, 1);

        // pulsamos el ultimo chat que es el que corresponde
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[last()]/td[3]/a"))
                .click();
        // ya no hay mensajes que pongan cargado
        SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "🗸Entregado",
                PO_View.getTimeout());

    }

    // PR036. Identificarse en la aplicación y enviar tres mensajes a una
    // oferta, validar que los mensajes enviados aparecen en el chat.
    // Identificarse después con el usuario propietario de la oferta y validar
    // que el número de mensajes sin leer aparece en su oferta.
    @Test
    public void PR40() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL, "test6@email.com");
        // pulsamos en la primera oferta que siga el criterio de búsqueda para
        // ir a su chat
        PO_ChatView.chat(driver, "justo");
        // comprobamos que el chat no está vacío
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "free", "//*[@id=\"chat\"]/div", PO_View.getTimeout());
        assertTrue(elementos.size() == 4);

        // insertamos un mensaje y comprobamos que aparece
        PO_ChatView.insertarMensaje(driver, "¿Sigue en pie la oferta?");
        // segundo mensaje
        PO_ChatView.insertarMensaje(driver, "hola?");
        // tercer mensaje
        PO_ChatView.insertarMensaje(driver, "es urgente");

        // ahora hay 5 mensajes en el chat
        elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
                "//*[@id=\"chat\"]/div", PO_View.getTimeout());
        assertTrue(elementos.size() == 7);

        // iniciamos sesión con el otro interlocutor y comprobamos que tiene 3
        // mensajes
        PO_View.comprobacionNotificaciones(driver, URL, 3);
    }

    // ~~~~~~~~~~~~~~~~~~~~~ AUXILIARES

    // PR041. Intento de acceso a zona privada sin sesión redirige a inicio de
    // sesión
    @Test
    public void PR41() {
        driver.navigate().to(URL + "/ofertas");
        List<WebElement> elementos = PO_View.checkElement(driver, "id",
                "identificacion-titulo");
        assertTrue(elementos.size() == 1);
    }

    // PR42. Inicio de acceso a login con sesión redirige a /home
    @Test
    public void PR42() {
        PO_LoginView.loginAdmin(driver);
        driver.navigate().to(URL + "/registrarse");
        SeleniumUtils.textoPresentePagina(driver,
                "Portal de ventas de segunda mano");

    }

    // PR43. Admin intenta acceder a zona de usuarios
    @Test
    public void PR43() {
        PO_LoginView.loginAdmin(driver);
        driver.navigate().to(URL + "/ofertas");
        SeleniumUtils.textoPresentePagina(driver, "Acceso restringido");

    }

    // PR44. Usuario intenta acceder a zona de admin
    @Test
    public void PR44() {
        // inicio correcto
        PO_LoginView.login(driver, "test1@email.com", "12345678");
        driver.navigate().to(URL + "/admin");
        SeleniumUtils.textoPresentePagina(driver, "Acceso restringido");

    }

    // PR45. Usuario intenta acceder a una página inexistente
    @Test
    public void PR45() {
        PO_LoginView.login(driver, "test1@email.com", "12345678");
        driver.navigate().to(URL + "/hrtgfewgreg");
        SeleniumUtils.textoPresentePagina(driver, "Página no encontrada");

    }

}
