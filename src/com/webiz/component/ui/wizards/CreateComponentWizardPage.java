package com.webiz.component.ui.wizards;

import java.io.File;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.Path;
import org.eclipse.jdt.internal.ui.dialogs.PackageSelectionDialog;
import org.eclipse.jdt.internal.ui.search.JavaSearchScopeFactory;
import org.eclipse.jface.dialogs.IDialogPage;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.ModifyEvent;
import org.eclipse.swt.events.ModifyListener;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.DirectoryDialog;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.dialogs.ContainerSelectionDialog;
import org.eclipse.ui.dialogs.ProjectLocationSelectionDialog;
import org.eclipse.ui.dialogs.ResourceSelectionDialog;


/**
 * The "New" wizard page allows setting the container for the new file as well
 * as the file name. The page will only accept file name without the extension
 * OR with the extension that matches the expected one (mpe).
 */

public class CreateComponentWizardPage extends WizardPage {
	private Text projectText;
	private Text packageText;
	private Text skinText;;
	private Text descText;;
	private Text titleText;
	private Combo componentType;
	private ISelection selection;
	private Button commonButton;
	private Button cloudButton;
	private Text cloudText;

	/**
	 * Constructor for SampleNewWizardPage.
	 * 
	 * @param pageName
	 */
	public CreateComponentWizardPage(ISelection selection) {
		super("wizardPage");
		setTitle("Webtree Component Project");
		setDescription("");
		this.selection = selection;
	}

	/**
	 * @see IDialogPage#createControl(Composite)
	 */
	public void createControl(Composite parent) {
		Composite container = new Composite(parent, SWT.NULL);
		GridLayout layout = new GridLayout();
		container.setLayout(layout);
		container.setLayoutData(new GridData(SWT. FILL,SWT.FILL, true, true, 1, 1));
		layout.numColumns = 3;
		layout.verticalSpacing = 9;
		
		Label label = new Label(container, SWT.NULL);
		label.setText("&Project:");
		projectText = new Text(container, SWT.BORDER | SWT.SINGLE);
		projectText.setEnabled(false);
		GridData gd = new GridData(GridData.FILL_HORIZONTAL);
		projectText.setLayoutData(gd);
		projectText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});
		
		Button button = new Button(container, SWT.PUSH);
		button.setText("Browse...");
		button.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent e) {
				handleBrowse();
			}
		});
	 
		
		SelectionListener selectionListener = new SelectionAdapter() {
			public void widgetSelected(SelectionEvent event) {
	        	Button button = ((Button) event.widget);
	        	if(button.getSelection()==true){
	        		dialogChanged();
	        		updatepackage();
	        	}
	         };
	      };
		
		label = new Label(container, SWT.NULL);
		label.setText("&Type");
		
		Group group = new Group(container, SWT.NONE);
		group.pack();
		group.setLayout(new GridLayout(2, false));
		group.setLayoutData(new GridData(SWT.FILL, SWT.FILL, true, true));
		
		/*RowLayout rowLayout = new RowLayout(SWT.VERTICAL);
		rowLayout.wrap = true;
		group.setLayout(rowLayout);*/
		commonButton = new Button(group, SWT.RADIO);
	    commonButton.setText("Common Module");
	    commonButton.setSelection(true);
	    commonButton.addSelectionListener(selectionListener);
	    commonButton.pack();
	    commonButton.setLocation(10, 10);
	    new Label(group, SWT.NULL);
	    
	    cloudButton = new Button(group, SWT.RADIO);
	    cloudButton.setText("Cloud Module : SITE ID ");
	    cloudButton.pack();
	    cloudButton.setLocation(10, 30);
	    cloudText = new Text( group, SWT.BORDER | SWT.SINGLE);
	    cloudText.pack();
	    cloudText.setLocation(110, 25);
	    cloudText.setEnabled(false);
	    cloudText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				updatepackage();
				dialogChanged();
			}
		});
	    cloudButton.addSelectionListener(selectionListener);
	    new Label(container, SWT.NULL);
	    
	    
		label = new Label(container, SWT.NULL);
		label.setText("&Category");
		
		componentType = new Combo(container, SWT.DROP_DOWN);
		componentType.setVisibleItemCount(2);
		componentType.add("Module");
		componentType.add("Widget");
		componentType.select(0);
		/*Point size = new Point(200, 50);
		componentType.setSize(size);*/
		
		componentType.addSelectionListener(new SelectionListener() {
			@Override
			public void widgetSelected(SelectionEvent e) {
				updatepackage();
				dialogChanged();
			}
			@Override
			public void widgetDefaultSelected(SelectionEvent e) {
			}
		});
		new Label(container, SWT.NULL);
		
		label = new Label(container, SWT.NULL);
		label.setText("&Title:");

		titleText = new Text(container, SWT.BORDER | SWT.SINGLE);
		label = new Label(container, SWT.NULL);
		
		gd = new GridData(GridData.FILL_HORIZONTAL);
		titleText.setLayoutData(gd);
		titleText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				System.out.println(((Text)e.widget).getText());
				dialogChanged();
				updatepackage();
			}
		});
		
		label = new Label(container, SWT.NULL);
		label.setText("&Package:");
		packageText = new Text(container, SWT.BORDER | SWT.SINGLE);
		gd = new GridData(GridData.FILL_HORIZONTAL);
		packageText.setLayoutData(gd);
		packageText.setEnabled(false);

		label = new Label(container, SWT.NULL);
		
		label = new Label(container, SWT.NULL);
		label.setText("&Skin Path:");
		skinText = new Text(container, SWT.BORDER | SWT.SINGLE);
		gd = new GridData(GridData.FILL_HORIZONTAL);
		skinText.setLayoutData(gd);
		skinText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});

		button = new Button(container, SWT.PUSH);
		button.setText("Browse...");
		button.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent e) {
				directoryhandleBrowse();
			}
		});

		label = new Label(container, SWT.NULL);
		label.setText("&Desc:");
		descText = new Text(container, SWT.BORDER | SWT.MULTI | SWT.V_SCROLL);
		gd = new GridData(GridData.FILL_BOTH);
		gd.heightHint = 60;
		descText.setLayoutData(gd);
		descText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});
		 
		/*ISelectionService service = getsh().getWorkbenchWindow().getSelectionService();
		IStructuredSelection structured = (IStructuredSelection) service.getSelection("org.eclipse.jdt.ui.PackageExplorer");
		IFile file = (IFile) structured.getFirstElement();
		IPath path = file.getLocation();
		System.out.println(path.toPortableString());*/
		
		initialize();
		dialogChanged();
		setControl(container);
		
	}

	/**
	 * Tests if the current workbench selection is a suitable container to use.
	 */

	private void initialize() {
		if (selection != null && selection.isEmpty() == false
				&& selection instanceof IStructuredSelection) {
			IStructuredSelection ssel = (IStructuredSelection) selection;
			if (ssel.size() > 1)
				return;
			Object obj = ssel.getFirstElement();
			if (obj instanceof IResource) {
				IContainer container;
				if (obj instanceof IContainer)
					container = (IContainer) obj;
				else
					container = ((IResource) obj).getParent();
				 
			}
		}
	}

	/**
	 * Uses the standard container selection dialog to choose the new value for
	 * the container field.
	 */

	private void handleBrowse() {
		ContainerSelectionDialog dialog = new ContainerSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot(), false,
				"Source Folder Selection");
		if (dialog.open() == ContainerSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				projectText.setText(((result[0]).toString()).replace("/", ""));
			}
		}
	}
	
	private void directoryhandleBrowse() {
		DirectoryDialog dialog = new DirectoryDialog(getShell());
		dialog.setMessage("Choose a save directory");
		String saveTarget = dialog.open();
		if(saveTarget != null)
		{
		   File directory = new File(saveTarget);
		   skinText.setText(directory.getPath());
		}
	}
	
	private void projecthandleBrowse() {
		ProjectLocationSelectionDialog dialog = new ProjectLocationSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot().getProject());
		if (dialog.open() == ProjectLocationSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				skinText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void resourcehandleBrowse() {
		ResourceSelectionDialog dialog = new ResourceSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot(), 
				"Resource Selection");
		if (dialog.open() == ResourceSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				skinText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void packageHandleBrowse() {
		PackageSelectionDialog dialog = new PackageSelectionDialog(getShell()
				, PlatformUI.getWorkbench().getProgressService(), PackageSelectionDialog.F_REMOVE_DUPLICATES
				, JavaSearchScopeFactory.getInstance().createWorkspaceScope(true));
		
		if (dialog.open() == ContainerSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				packageText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	private void updatepackage(){

		String packagePath="com.namo.pt.component."+componentType.getText()+"."+getTitle();;
		if(cloudButton.getSelection()){
			packagePath = "com.namo.pt.cloud."+cloudText.getText()+".component."+componentType.getText()+"."+getTitle();
		}
		
		packageText.setText(packagePath);
		
		return;
	}
	
	/**
	 * Ensures that both text fields are set.
	 */
	private void dialogChanged() {
		IResource container = ResourcesPlugin.getWorkspace().getRoot()
				.findMember(new Path(getSkin()));
		String title = getTitle();
		String project = getProject();
	
		setDescription("");
		
		if(project.equals("")){
			updateStatus("Project must be specified");
			projectText.setFocus();
			return;
		}
		
		if(cloudButton.getSelection() && cloudText.getText().equals("")){
			updateStatus("cloud name must be specified");
			cloudText.setEnabled(true);
			cloudText.setFocus();
			return;
		}
		
		if(commonButton.getSelection()){
			cloudText.setEnabled(false);
			if(!cloudText.getText().equals(""))
				cloudText.setText("");
		}
		
		if(title.length() == 0){
			updateStatus("Title must be specified");
			return;
		}
		 
		if (getSkin().length() == 0) {
			updateStatus("skin Path must be specified");
			return;
		}
		 
		updateStatus(null);
	}

	private void updateStatus(String message) {
		
		setErrorMessage(message);
		setPageComplete(message == null);
	}

	public String getSkin() {
		return skinText.getText();
	}

	public String getTitle() {
		return titleText.getText();
	}
	
	public String getProject(){
		return projectText.getText();
	}
	
	public String getPakcage(){
		return packageText.getText();
	}
	
	public String getComonentType(){
		return componentType.getText();
	}
	
	public String getSiteID(){
		return cloudText.getText();
	}
	
	 
	
}