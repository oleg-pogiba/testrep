<?php
/**
 * Виджет для отрисовки блока контента:
 *
 * @category YupeWidgets
 * @package  yupe.modules.contentblock.widgets
 * @author   Yupe Team <team@yupe.ru>
 * @license  BSD http://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F_BSD
 * @link     http://yupe.ru
 *
 **/
Yii::import('application.modules.contentblock.models.ContentBlock');

class ContentBlockWidget extends YWidget
{
	public $code;
	public $silent = false;
	public $view = 'contentblock';

	public function init()
	{
		if (empty($this->code))
			throw new CException(Yii::t('ContentBlockModule.contentblock', 'Insert content block title for ContentBlockWidget!'));

		$this->silent = (bool)$this->silent;
	}

	public function run()
	{
		$cacheName = "ContentBlock{$this->code}" . Yii::app()->language;

		$output = Yii::app()->cache->get($cacheName);

		if ($output === false) {

<<<<<<< HEAD
			$block = ContentBlock::model()->find('code = :code', array(':code' => $this->code));
=======
			$block = ContentBlock::model()->find('code = :code and lang = :lang', array(':code' => $this->code, ':lang'=> Yii::app()->language));
>>>>>>> parent of 59337da... добавил многоязычность меню

			if (null === $block) {
				if ($this->silent === false) {
					throw new CException(
						Yii::t(
							'ContentBlockModule.contentblock', 'Content block "{code}" was not found !', array(
								'{code}' => $this->code
							)
						)
					);
				}

				$output = '';

			} else {

				switch ($block->type) {

					case ContentBlock::PHP_CODE:
						$output = eval($block->content);
						break;
					case ContentBlock::SIMPLE_TEXT:
						$output = CHtml::encode($block->content);
						break;
					case ContentBlock::HTML_TEXT:
						$output = $block->content;
						break;
				}
			}

			Yii::app()->cache->set($cacheName, $output);
		}

		$this->render($this->view, array('output' => $output));
	}
}