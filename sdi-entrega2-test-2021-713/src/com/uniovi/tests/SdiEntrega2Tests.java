package com.uniovi.tests;

//Paquetes Java
import java.util.List;
//Paquetes JUnit 
import org.junit.*;
import org.junit.runners.MethodSorters;
import static org.junit.Assert.assertTrue;
//Paquetes Selenium 
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.*;
//Paquetes Utilidades de Testing Propias
import com.uniovi.tests.util.SeleniumUtils;
//Paquetes con los Page Object
import com.uniovi.tests.pageobjects.*;

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

	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() {
		// Configuramos las pruebas.
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
		assertTrue("PR01 sin hacer", false);
	}

	// PR02. Registro de Usuario con datos inválidos (email, nombre y apellidos
	// vacíos).
	@Test
	public void PR02() {
		assertTrue("PR02 sin hacer", false);
	}

	// PR03. Registro de Usuario con datos inválidos (repetición de contraseña
	// inválida).
	@Test
	public void PR03() {
		assertTrue("PR03 sin hacer", false);
	}

	// PR04. Registro de Usuario con datos inválidos (email existente).
	@Test
	public void PR04() {
		assertTrue("PR04 sin hacer", false);
	}

	// PR05. Inicio de sesión con datos válidos.
	@Test
	public void PR05() {
		assertTrue("PR05 sin hacer", false);
	}

	// PR06. Inicio de sesión con datos inválidos (emailexistente,pero contraseña
	// incorrecta).
	@Test
	public void PR06() {
		assertTrue("PR06 sin hacer", false);
	}

	// PR07. Inicio de sesión con datos inválidos (campo email o contraseña vacíos).
	@Test
	public void PR07() {
		assertTrue("PR07 sin hacer", false);
	}

	// PR08. Inicio de sesión con datos inválidos (email no existente en la
	// aplicación).
	@Test
	public void PR08() {
		assertTrue("PR08 sin hacer", false);
	}

	// PR09. Hacer click en la opción de salir de sesión y comprobar que se redirige
	// a la página de inicio de sesión(Login).
	@Test
	public void PR09() {
		assertTrue("PR09 sin hacer", false);
	}

	// PR10. Comprobarque el botón cerrar sesión no estávisible si el usuario no
	// está autenticado.
	@Test
	public void PR10() {
		assertTrue("PR10 sin hacer", false);
	}

	// PR11. Mostrar el listado deusuarios y comprobar que se muestran todos los que
	// existen en el sistema.
	@Test
	public void PR11() {
		assertTrue("PR11 sin hacer", false);
	}

	// PR12. Ir a la lista de usuarios,borrar el primer usuario de la
	// lista, comprobar que la lista seactualiza y dicho usuario desaparece.
	@Test
	public void PR12() {
		assertTrue("PR12 sin hacer", false);
	}

	// PR13. Ir a la lista de usuarios,borrar el último usuario de lalista,
	// comprobar que lalista seactualizay dicho usuario desaparece.
	@Test
	public void PR13() {
		assertTrue("PR13 sin hacer", false);
	}

	// PR14. Ir a la lista deusuarios,borrar 3 usuarios, comprobar que la lista se
	// actualiza y dichos usuarios desaparecen.
	@Test
	public void PR14() {
		assertTrue("PR14 sin hacer", false);
	}

	// PR15. Ir al formulario de alta de oferta, rellenarla con datos válidos y
	// pulsar el botón Submit. Comprobar que la oferta sale en el listado de ofertas
	// de dicho usuario.
	@Test
	public void PR15() {
		assertTrue("PR15 sin hacer", false);
	}

	// PR16. Ir al formulario dealta de oferta, rellenarla con datos inválidos
	// (campo
	// título vacíoy precio en negativo) y pulsar el botón Submit. Comprobar que se
	// muestra el mensaje de campo obligatorio.
	@Test
	public void PR16() {
		assertTrue("PR16 sin hacer", false);
	}

	// PR017. Mostrar el listado de ofertas para dicho usuarioy comprobar que se
	// muestran todas las que existen para este usuario
	@Test
	public void PR17() {
		assertTrue("PR17 sin hacer", false);
	}

	// PR18. Ir a la lista de ofertas, borrar la primera oferta de la lista,
	// comprobar que la lista se actualiza y que la oferta desaparece.
	@Test
	public void PR18() {
		assertTrue("PR18 sin hacer", false);
	}

	// PR19. Ir a la lista de ofertas, borrar la última oferta de la lista,
	// comprobar que la lista se actualiza y que laoferta desaparece.
	@Test
	public void PR19() {
		assertTrue("PR19 sin hacer", false);
	}

	// P20. Hacer una búsqueda con el campo vacío ycomprobar que se
	// muestra la página que corresponde con el listado de las ofertas existentes en
	// el sistema
	@Test
	public void PR20() {
		assertTrue("PR20 sin hacer", false);
	}

	// PR21. Hacer una búsqueda escribiendo en el campo untexto que no exista y
	// comprobar que se muestrala página que corresponde, con la listade ofertas
	// vacía.
	@Test
	public void PR21() {
		assertTrue("PR21 sin hacer", false);
	}

	// PR22. Hacer una búsqueda escribiendo en el campo un texto en minúscula o
	// mayúscula y comprobar que se muestra la página que corresponde, con la
	// lista de ofertas que contengan dicho texto, independientemente que el título
	// esté almacenado en minúsculas o mayúscula.
	@Test
	public void PR22() {
		assertTrue("PR22 sin hacer", false);
	}

	// PR23. Sobre una búsqueda determinada (a elección de desarrollador),
	// comprar una oferta que deja un saldo positivo en el contador del comprobador.
	// Y comprobar que el contador se actualiza correctamente en la vista del
	// comprador
	@Test
	public void PR23() {
		assertTrue("PR23 sin hacer", false);
	}

	// PR24. Sobre una búsqueda determinada (a elección de desarrollador),
	// comprar una oferta que deja un saldo 0 en el contador del comprobador. Y
	// comprobar que el contador se actualiza correctamente en la vista del
	// comprador.
	@Test
	public void PR24() {
		assertTrue("PR24 sin hacer", false);
	}

	// PR25. Sobre una búsqueda determinada (a elección de desarrollador), intentar
	// comprar una oferta que esté por encima de saldo disponible del comprador. Y
	// comprobar que semuestra el mensaje de saldo no suficiente.
	@Test
	public void PR25() {
		assertTrue("PR25 sin hacer", false);
	}

	// PR26. Ir a la opción de ofertas compradas del usuario y mostrar la lista.
	// Comprobar que aparecen las ofertas que deben aparecer.
	@Test
	public void PR26() {
		assertTrue("PR26 sin hacer", false);
	}

	// PR27. Al crear una oferta marcar dicha oferta como destacada y a continuación
	// comprobar: i) que aparece en el listado de ofertas destacadas para los
	// usuarios y que el saldo del usuario se actualiza adecuadamente en la vista
	// del ofertante (-20).
	@Test
	public void PR27() {
		assertTrue("PR27 sin hacer", false);
	}

	// PR28. Sobre el listado de ofertas de un usuario con másde 20 euros de saldo,
	// pinchar en el enlace Destacada y a continuación comprobar: i) que aparece en
	// el listadode ofertas destacadas para los usuarios y que el saldo del usuario
	// se actualiza adecuadamente en la vista del ofertante (-20)
	@Test
	public void PR28() {
		assertTrue("PR28 sin hacer", false);
	}

	// PR029. Sobre el listado de ofertas de un usuario con menos de 20 euros de
	// saldo, pinchar en el enlace Destacada y a continuación comprobar que se
	// muestra el mensaje de saldo no suficiente.
	@Test
	public void PR29() {
		assertTrue("PR29 sin hacer", false);
	}

	// PR030. Inicio de sesión con datos válidos.
	@Test
	public void PR30() {
		assertTrue("PR30 sin hacer", false);
	}

	// PR031. Inicio de sesión con datos inválidos (email existente, pero contraseña
	// incorrecta).
	@Test
	public void PR31() {
		assertTrue("PR31 sin hacer", false);
	}

	// PR032. Inicio de sesión condatos válidos (campo email o contraseña vacíos).
	@Test
	public void PR32() {
		assertTrue("PR32 sin hacer", false);
	}

	// PR033. Mostrar el listadode ofertas disponibles y comprobar que se muestran
	// todas las que existen, menos las del usuario identificado.
	@Test
	public void PR33() {
		assertTrue("PR33 sin hacer", false);
	}

	// PR034. Sobre una búsqueda determinada de ofertas (a elección de
	// desarrollador), enviar un mensaje a una oferta concreta. Se abriría dicha
	// conversación por primera vez. Comprobar que el mensaje aparece en el
	// listado de mensajes
	@Test
	public void PR34() {
		assertTrue("PR34 sin hacer", false);
	}

	// PR035. Sobre el listado de conversaciones enviar un mensaje a una
	// conversación ya abierta. Comprobar que el mensaje aparece en el listado de
	// mensajes.
	@Test
	public void PR35() {
		assertTrue("PR35 sin hacer", false);
	}

	// ~~~~~~~~~~~~~~~~~~~~~ AUXILIARES

}
