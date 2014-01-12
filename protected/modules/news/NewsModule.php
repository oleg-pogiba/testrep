<?php

/**
 * NewsModule основной класс модуля news
 *
 * @package yupe.modules.news
 * @since 0.1
 *
 */

use yupe\components\WebModule;

class NewsModule extends WebModule
{
	public $uploadPath = 'news';
	public $allowedExtensions = 'jpg,jpeg,png,gif';
	public $minSize = 0;
	public $maxSize = 5368709120;
	public $maxFiles = 1;
	public $rssCount = 10;
	public $perPage = 10;

	public function getDependencies()
	{
		return array(
			'user',
			'category',
		);
	}

	public function getUploadPath()
	{
		return Yii::getPathOfAlias('webroot') . '/' . Yii::app()->getModule('yupe')->uploadPath . '/' . $this->uploadPath . '/';
	}

	public function getInstall()
	{
		if (parent::getInstall()) {
			@mkdir($this->getUploadPath(), 0755);
		}

		return false;
	}

	public function checkSelf()
	{
		$messages = array();

		$uploadPath = $this->getUploadPath();

		if (!is_writable($uploadPath))
			$messages[WebModule::CHECK_ERROR][] = array(
				'type' => WebModule::CHECK_ERROR,
				'message' => Yii::t('NewsModule.news', 'Directory "{dir}" is not accessible for write! {link}', array(
						'{dir}' => $uploadPath,
						'{link}' => CHtml::link(Yii::t('NewsModule.news', 'Change settings'), array(
								'/yupe/backend/modulesettings/',
								'module' => 'news',
							)),
					)),
			);

		return (isset($messages[WebModule::CHECK_ERROR])) ? $messages : true;
	}

	public function getParamsLabels()
	{
		return array(
			'mainCategory' => Yii::t('NewsModule.news', 'Main news category'),
			'adminMenuOrder' => Yii::t('NewsModule.news', 'Menu items order'),
			'editor' => Yii::t('NewsModule.news', 'Visual Editor'),
			'uploadPath' => Yii::t('NewsModule.news', 'Uploading files catalog (relatively {path})', array('{path}' => Yii::getPathOfAlias('webroot') . DIRECTORY_SEPARATOR . Yii::app()->getModule("yupe")->uploadPath)),
			'allowedExtensions' => Yii::t('NewsModule.news', 'Accepted extensions (separated by comma)'),
			'minSize' => Yii::t('NewsModule.news', 'Minimum size (in bytes)'),
			'maxSize' => Yii::t('NewsModule.news', 'Maximum size (in bytes)'),
			'rssCount' => Yii::t('NewsModule.news', 'RSS records'),
			'perPage' => Yii::t('NewsModule.news', 'News per page')
		);
	}

	public function getEditableParams()
	{
		return array(
			'adminMenuOrder',
			'editor' => Yii::app()->getModule('yupe')->getEditors(),
			'mainCategory' => CHtml::listData($this->getCategoryList(), 'id', 'name'),
			'uploadPath',
			'allowedExtensions',
			'minSize',
			'maxSize',
			'rssCount',
			'perPage'
		);
	}

	public function getVersion()
	{
		return Yii::t('NewsModule.news', '0.6');
	}

	public function getIsInstallDefault()
	{
		return true;
	}

	public function getCategory()
	{
		return Yii::t('NewsModule.news', 'Content');
	}

	public function getName()
	{
		return Yii::t('NewsModule.news', 'News');
	}

	public function getDescription()
	{
		return Yii::t('NewsModule.news', 'Module for creating and management news');
	}

	public function getAuthor()
	{
		return Yii::t('NewsModule.news', 'yupe team');
	}

	public function getAuthorEmail()
	{
		return Yii::t('NewsModule.news', 'team@yupe.ru');
	}

	public function getUrl()
	{
		return Yii::t('NewsModule.news', 'http://yupe.ru');
	}

	public function getIcon()
	{
		return "leaf";
	}

	public function getAdminPageLink()
	{
		return '/news/newsBackend/index';
	}

	public function getNavigation()
	{
		return array(
			array('icon' => 'list-alt', 'label' => Yii::t('NewsModule.news', 'News list'), 'url' => array('/news/newsBackend/index')),
			array('icon' => 'plus-sign', 'label' => Yii::t('NewsModule.news', 'Create article'), 'url' => array('/news/newsBackend/create')),
		);
	}

	public function isMultiLang()
	{
		return true;
	}

	public function init()
	{
		parent::init();

		$this->setImport(array(
			'news.models.*'
		));
	}
}